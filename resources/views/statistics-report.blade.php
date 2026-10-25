<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: sans-serif; font-size: 12px; color: #333; }
    .header { text-align: center; border-bottom: 2px solid #0F5C5E; padding-bottom: 10px; margin-bottom: 20px; }
    .header h1 { font-size: 16px; margin: 0; color: #0F5C5E; }
    .header h2 { font-size: 13px; margin: 4px 0 0; font-weight: normal; }
    .meta { display: flex; justify-content: space-between; font-size: 11px; color: #666; margin-bottom: 20px; }
    .section { margin-bottom: 20px; }
    .section h3 { font-size: 13px; color: #0F5C5E; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; font-size: 11px; }
    th { background: #f5f5f5; font-weight: 600; }
    .summary-grid { display: flex; gap: 12px; margin-bottom: 20px; }
    .summary-card { flex: 1; border: 1px solid #ddd; border-radius: 4px; padding: 10px; text-align: center; }
    .summary-card .value { font-size: 22px; font-weight: bold; color: #0F5C5E; }
    .summary-card .label { font-size: 10px; color: #666; margin-top: 2px; }
    .footer { text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PEMERINTAH KECAMATAN TARAKAN UTARA</h1>
    <h2>Laporan Statistik Pengaduan & Permohonan Informasi</h2>
  </div>

  <div class="meta">
    <span>Periode: {{ $periodLabel }}</span>
    <span>Dicetak: {{ $printedAt }} WITA</span>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="value">{{ $stats['totalComplaints'] }}</div>
      <div class="label">Total Pengaduan</div>
    </div>
    <div class="summary-card">
      <div class="value">{{ $stats['totalInfoRequests'] }}</div>
      <div class="label">Permohonan Informasi</div>
    </div>
    <div class="summary-card">
      <div class="value">{{ $stats['statusCounts']['COMPLETED'] ?? 0 }}</div>
      <div class="label">Selesai</div>
    </div>
    <div class="summary-card">
      <div class="value">{{ count($stats['unfollowedComplaints']) }}</div>
      <div class="label">Belum Ditindaklanjuti</div>
    </div>
  </div>

  <div class="section">
    <h3>Status Pengaduan</h3>
    <table>
      <thead>
        <tr><th>Status</th><th>Jumlah</th><th>Persentase</th></tr>
      </thead>
      <tbody>
        @forelse($stats['statusCounts'] as $status => $count)
          <tr>
            <td>{{ $statusLabels[$status] ?? $status }}</td>
            <td>{{ $count }}</td>
            <td>{{ $stats['totalComplaints'] > 0 ? round($count / $stats['totalComplaints'] * 100, 1) : 0 }}%</td>
          </tr>
        @empty
          <tr><td colspan="3" style="text-align:center;color:#999;">Belum ada data</td></tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Berdasarkan Kategori</h3>
    <table>
      <thead>
        <tr><th>Kategori</th><th>Jumlah</th><th>Persentase</th></tr>
      </thead>
      <tbody>
        @forelse($stats['categoryCounts'] as $name => $count)
          <tr>
            <td>{{ $name }}</td>
            <td>{{ $count }}</td>
            <td>{{ $stats['totalComplaints'] > 0 ? round($count / $stats['totalComplaints'] * 100, 1) : 0 }}%</td>
          </tr>
        @empty
          <tr><td colspan="3" style="text-align:center;color:#999;">Belum ada data</td></tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Trend: {{ $stats['trendLabel'] }}</h3>
    <table>
      <thead>
        <tr><th>Periode</th><th>Jumlah</th></tr>
      </thead>
      <tbody>
        @foreach($stats['trend'] as $key => $total)
          <tr>
            <td>{{ $key }}</td>
            <td>{{ $total }}</td>
          </tr>
        @endforeach
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Pengaduan Terbaru</h3>
    <table>
      <thead>
        <tr><th>Tiket</th><th>Judul</th><th>Status</th><th>Kategori</th><th>Tanggal</th></tr>
      </thead>
      <tbody>
        @forelse($stats['recentComplaints'] as $complaint)
          <tr>
            <td>{{ $complaint['ticket'] }}</td>
            <td>{{ $complaint['title'] }}</td>
            <td>{{ $statusLabels[$complaint['status']] ?? $complaint['status'] }}</td>
            <td>{{ $complaint['category'] }}</td>
            <td>{{ $complaint['created_at'] }}</td>
          </tr>
        @empty
          <tr><td colspan="5" style="text-align:center;color:#999;">Belum ada pengaduan</td></tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <div class="footer">
    Laporan ini digenerate secara otomatis oleh Kecamatan Tarakan Utara
  </div>
</body>
</html>
