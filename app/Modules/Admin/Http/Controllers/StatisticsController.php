<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Models\Complaint;
use App\Models\InfoRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    private function getStats(string $period): array
    {
        $period = in_array($period, ['harian', 'mingguan', 'bulanan', 'tahunan'], true) ? $period : 'bulanan';
        $cacheKey = "admin.statistics.{$period}";

        return Cache::remember($cacheKey, 60, function () use ($period) {
            $now = Carbon::now();

            $config = match ($period) {
                'harian' => [
                    'trend' => $now->copy()->subDays(6)->startOfDay(),
                    'format' => 'Y-m-d',
                    'fillKey' => fn ($i) => $now->copy()->subDays(6 - $i)->format('Y-m-d'),
                    'fillCount' => 7,
                    'trendLabel' => '7 hari terakhir',
                ],
                'mingguan' => [
                    'trend' => $now->copy()->subWeeks(3)->startOfWeek(),
                    'format' => 'o-W',
                    'fillKey' => fn ($i) => $now->copy()->subWeeks(3 - $i)->startOfWeek()->format('o-W'),
                    'fillCount' => 4,
                    'trendLabel' => '4 minggu terakhir',
                ],
                'tahunan' => [
                    'trend' => $now->copy()->subYears(4)->startOfYear(),
                    'format' => 'Y',
                    'fillKey' => fn ($i) => $now->copy()->subYears(4 - $i)->format('Y'),
                    'fillCount' => 5,
                    'trendLabel' => '5 tahun terakhir',
                ],
                default => [
                    'trend' => $now->copy()->subMonths(11)->startOfMonth(),
                    'format' => 'Y-m',
                    'fillKey' => fn ($i) => $now->copy()->subMonths(11 - $i)->format('Y-m'),
                    'fillCount' => 12,
                    'trendLabel' => '12 bulan terakhir',
                ],
            };

            $statusCounts = Complaint::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray();

            // Agregasi tren di SQL, bukan get() + groupBy PHP.
            // ponytail: strftime untuk sqlite (tes), DATE_FORMAT untuk mysql
            $trendData = Complaint::where('created_at', '>=', $config['trend'])
                ->selectRaw($this->trendGroupExpr($config['format']).' as grp, count(*) as total')
                ->groupBy('grp')
                ->pluck('total', 'grp')
                ->toArray();

            $trend = [];
            for ($i = 0; $i < $config['fillCount']; $i++) {
                $key = $config['fillKey']($i);
                $trend[$key] = $trendData[$key] ?? 0;
            }

            $categoryCounts = Complaint::join('categories', 'complaints.category_id', '=', 'categories.id')
                ->selectRaw('categories.name, count(*) as total')
                ->groupBy('categories.name')
                ->orderByDesc('total')
                ->pluck('total', 'name')
                ->toArray();

            $infoStatusCounts = InfoRequest::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray();

            $recentComplaints = Complaint::with('category')
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'ticket' => $c->ticket,
                    'title' => $c->title,
                    'status' => $c->status->value,
                    'category' => $c->category?->name ?? '-',
                    'created_at' => $c->created_at->format('d/m/Y H:i'),
                ])
                ->toArray();

            $unfollowed = Complaint::where('status', 'SUBMITTED')
                ->where('created_at', '<', $now->copy()->subDay())
                ->with('category')
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'ticket' => $c->ticket,
                    'title' => $c->title,
                    'category' => $c->category?->name ?? '-',
                    'created_at' => $c->created_at->format('d/m/Y H:i'),
                ])
                ->toArray();

            return [
                'totalComplaints' => Complaint::count(),
                'statusCounts' => $statusCounts,
                'trend' => $trend,
                'trendLabel' => $config['trendLabel'],
                'categoryCounts' => $categoryCounts,
                'totalInfoRequests' => InfoRequest::count(),
                'infoStatusCounts' => $infoStatusCounts,
                'recentComplaints' => $recentComplaints,
                'unfollowedComplaints' => $unfollowed,
                'period' => $period,
            ];
        });
    }

    private function trendGroupExpr(string $format): string
    {
        if (DB::getDriverName() === 'sqlite') {
            return match ($format) {
                'Y-m-d' => "strftime('%Y-%m-%d', created_at)",
                'o-W' => "strftime('%Y-%W', created_at)",
                'Y' => "strftime('%Y', created_at)",
                default => "strftime('%Y-%m', created_at)",
            };
        }

        return match ($format) {
            'Y-m-d' => "DATE_FORMAT(created_at,'%Y-%m-%d')",
            'o-W' => "DATE_FORMAT(created_at,'%x-%v')",
            'Y' => "DATE_FORMAT(created_at,'%Y')",
            default => "DATE_FORMAT(created_at,'%Y-%m')",
        };
    }

    public function index(Request $request)
    {
        $period = $request->input('period', 'bulanan');
        $stats = $this->getStats($period);

        return inertia('Admin/Statistics', ['stats' => $stats]);
    }

    public function export(Request $request)
    {
        $period = $request->input('period', 'bulanan');
        $stats = $this->getStats($period);

        $periodLabels = [
            'harian' => 'Harian — 7 Hari Terakhir',
            'mingguan' => 'Mingguan — 4 Minggu Terakhir',
            'bulanan' => 'Bulanan — 12 Bulan Terakhir',
            'tahunan' => 'Tahunan — 5 Tahun Terakhir',
        ];

        $statusLabels = [
            'SUBMITTED' => 'Diterima',
            'VERIFIED' => 'Diverifikasi',
            'PROCESSING' => 'Diproses',
            'COMPLETED' => 'Selesai',
            'REJECTED' => 'Ditolak',
        ];

        $pdf = Pdf::loadView('statistics-report', [
            'stats' => $stats,
            'periodLabel' => $periodLabels[$period] ?? $period,
            'statusLabels' => $statusLabels,
            'printedAt' => Carbon::now()->timezone('Asia/Makassar')->format('d/m/Y H:i'),
        ]);

        $filename = "laporan-statistik-{$period}-".Carbon::now()->timezone('Asia/Makassar')->format('Y-m-d').'.pdf';

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$filename}\"",
        ]);
    }
}
