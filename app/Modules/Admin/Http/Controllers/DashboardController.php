<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Models\Agenda;
use App\Models\Complaint;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = Cache::remember('admin.dashboard.statistics', 60, function () {
            $now = Carbon::now();
            $monthStart = $now->copy()->startOfMonth();
            $monthEnd = $now->copy()->endOfMonth();

            // Status counts (this month)
            $statusCounts = Complaint::whereBetween('created_at', [$monthStart, $monthEnd])
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray();

            // Category breakdown (this month)
            $categoryCounts = Complaint::join('categories', 'complaints.category_id', '=', 'categories.id')
                ->whereBetween('complaints.created_at', [$monthStart, $monthEnd])
                ->selectRaw('categories.name, count(*) as total')
                ->groupBy('categories.name')
                ->orderByDesc('total')
                ->pluck('total', 'name')
                ->toArray();

            // Monthly trend (12 months) — agregasi di SQL, bukan get() + groupBy PHP
            // ponytail: strftime untuk sqlite (tes), DATE_FORMAT untuk mysql
            $monthExpr = DB::getDriverName() === 'sqlite'
                ? "strftime('%Y-%m', created_at)"
                : "DATE_FORMAT(created_at,'%Y-%m')";
            $monthlyTrend = Complaint::where('created_at', '>=', $now->copy()->subMonths(11)->startOfMonth())
                ->selectRaw("{$monthExpr} as ym, count(*) as total")
                ->groupBy('ym')
                ->pluck('total', 'ym')
                ->toArray();

            $monthly = [];
            for ($i = 11; $i >= 0; $i--) {
                $key = $now->copy()->subMonths($i)->format('Y-m');
                $monthly[$key] = $monthlyTrend[$key] ?? 0;
            }

            // Recent complaints
            $recentComplaints = Complaint::with('category')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'ticket' => $c->ticket,
                    'title' => $c->title,
                    'status' => $c->status->value,
                    'category' => $c->category?->name ?? '-',
                    'created_at' => $c->created_at,
                ]);

            // Unfollowed (SUBMITTED > 1 day)
            $unfollowed = Complaint::where('status', 'SUBMITTED')
                ->where('created_at', '<', $now->copy()->subDay())
                ->with('category')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'ticket' => $c->ticket,
                    'title' => $c->title,
                    'category' => $c->category?->name ?? '-',
                    'created_at' => $c->created_at,
                ]);

            return [
                'totalComplaints' => Complaint::count(),
                'complaintsNew' => $statusCounts['SUBMITTED'] ?? 0,
                'complaintsVerified' => $statusCounts['VERIFIED'] ?? 0,
                'complaintsProcessing' => $statusCounts['PROCESSING'] ?? 0,
                'complaintsCompleted' => $statusCounts['COMPLETED'] ?? 0,
                'complaintsRejected' => $statusCounts['REJECTED'] ?? 0,
                'unreadMessages' => Message::where('is_read', false)->count(),
                'totalUsers' => User::count(),
                'statusCounts' => $statusCounts,
                'monthlyTrend' => $monthly,
                'categoryCounts' => $categoryCounts,
                'recentComplaints' => $recentComplaints,
                'unfollowedComplaints' => $unfollowed,
            ];
        });

        $now = Carbon::now();

        $recentMessages = Message::latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'subject', 'body', 'is_read', 'created_at']);

        $agendaThisMonth = Agenda::whereBetween('starts_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])
            ->where('is_published', true)
            ->get(['id', 'title', 'starts_at']);

        return inertia('Admin/Dashboard', [
            'stats' => $stats,
            'recentMessages' => $recentMessages,
            'agendaThisMonth' => $agendaThisMonth,
        ]);
    }
}
