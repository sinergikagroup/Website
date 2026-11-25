export type ProjectCategory = 'Software' | 'Apps' | 'IoT' | 'Robotics';

export interface ServiceItem {
  id: ProjectCategory;
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  accent: 'lime' | 'coral';
  span: string;
  technologies: string[];
  useCases: {
    title: string;
    outcome: string;
  }[];
}

export interface WorkflowStep {
  number: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const PAIN_POINTS = [
  {
    number: '01',
    problem: 'Alur kerja manual yang lambat dan rentan kesalahan input.',
    detail:
      'Data tersebar di puluhan spreadsheet terpisah, membuat pengambilan keputusan operasional tertunda berjam-jam.',
  },
  {
    number: '02',
    problem: 'Perangkat keras lapangan berjalan tanpa visibilitas pusat.',
    detail:
      'Mesin produksi, sensor suhu, dan panel daya bekerja terisolasi tanpa peringatan dini saat terjadi anomali.',
  },
  {
    number: '03',
    problem: 'Aplikasi generik yang kaku dan memaksa tim beradaptasi.',
    detail:
      'Perangkat lunak siap pakai sering kali tidak cocok dengan logika bisnis unik Anda sehingga menambah biaya lisensi sia-sia.',
  },
];

export const IMPACT_METRICS = [
  {
    value: '3,4×',
    label: 'Lebih cepat memproses siklus data lapangan',
    context: 'Rata-rata migrasi sistem manual ke platform terintegrasi dalam 90 hari',
  },
  {
    value: '< 45 ms',
    label: 'Latensi telemetri perangkat ke dashboard',
    context: 'Arsitektur MQTT & WebSocket untuk pemantauan lini produksi real-time',
  },
  {
    value: '99,94%',
    label: 'Ketersediaan sistem operasional tahunan',
    context: 'Pemantauan otomatis 24/7 dan failover teruji di lingkungan industri',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'Software',
    index: '01',
    title: 'Custom Software',
    subtitle: 'Arsitektur ERP, API & Sistem Enterprise',
    summary:
      'Kami merancang sistem inti yang dibangun persis mengikuti logika operasional perusahaan Anda—bukan sebaliknya.',
    accent: 'lime',
    span: 'lg:col-span-7',
    technologies: ['TypeScript', 'Go', 'PostgreSQL', 'GraphQL', 'Docker', 'Kubernetes'],
    useCases: [
      {
        title: 'Sistem Manajemen Inventaris & Rantai Pasok',
        outcome: 'Sinkronisasi stok multi-gudang real-time dengan rekonsiliasi otomatis.',
      },
      {
        title: 'Platform Billing & Orkestrasi Layanan B2B',
        outcome: 'Otomatisasi penagihan berulang dan integrasi gerbang pembayaran lokal.',
      },
    ],
  },
  {
    id: 'Apps',
    index: '02',
    title: 'Mobile & Web Apps',
    subtitle: 'Antarmuka Operasional & Aplikasi Pelanggan',
    summary:
      'Aplikasi web dan seluler berkecepatan tinggi yang nyaman digunakan teknisi lapangan maupun pelanggan akhir.',
    accent: 'coral',
    span: 'lg:col-span-5',
    technologies: ['React', 'Next.js', 'Flutter', 'React Native', 'Tailwind CSS', 'Offline Sync'],
    useCases: [
      {
        title: 'Aplikasi Inspeksi Lapangan Offline-First',
        outcome: 'Tetap berfungsi di area tanpa sinyal dan sinkron otomatis saat daring.',
      },
      {
        title: 'Portal Klien & Dashboard Analitik Eksekutif',
        outcome: 'Visualisasi KPI harian yang ringkas dengan kontrol akses berbasis peran.',
      },
    ],
  },
  {
    id: 'IoT',
    index: '03',
    title: 'Internet of Things',
    subtitle: 'Sensor Pintar, Gateway & Telemetri Cloud',
    summary:
      'Menghubungkan mesin industri, sensor lingkungan, dan perangkat keras ke satu jaringan kendali yang aman.',
    accent: 'coral',
    span: 'lg:col-span-5',
    technologies: ['ESP32 / STM32', 'MQTT', 'LoRaWAN', 'Modbus RTU', 'InfluxDB', 'Edge AI'],
    useCases: [
      {
        title: 'Pemantauan Energi & HVAC Gedung Otomatis',
        outcome: 'Penghematan konsumsi daya hingga 24% melalui penjadwalan adaptif.',
      },
      {
        title: 'Cold-Chain & Gudang Farmasi Terpantau',
        outcome: 'Peringatan instan ke WhatsApp dan dashboard bila suhu keluar ambang batas.',
      },
    ],
  },
  {
    id: 'Robotics',
    index: '04',
    title: 'Robotics & Automation',
    subtitle: 'Kendali Gerak, Visi Komputer & Lengan Robotik',
    summary:
      'Otomasi tugas berulang dan berisiko tinggi menggunakan sistem robotika terprogram yang presisi.',
    accent: 'lime',
    span: 'lg:col-span-7',
    technologies: ['ROS 2', 'C++ / Python', 'OpenCV', 'PLC Integration', 'EtherCAT', '6-DOF Kinematics'],
    useCases: [
      {
        title: 'Lengan Robotik Sortir & Pick-and-Place',
        outcome: 'Deteksi cacat visual otomatis dengan akurasi posisi sub-milimeter.',
      },
      {
        title: 'Autonomous Mobile Robot (AMR) Logistik',
        outcome: 'Navigasi gudang otonom terintegrasi dengan sistem manajemen pesanan.',
      },
    ],
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Discovery & Riset',
    duration: '1–2 Minggu',
    description:
      'Audit alur kerja lapangan, pemetaan perangkat keras yang sudah ada, dan perumusan spesifikasi teknis yang terukur.',
    deliverables: ['Dokumen Arsitektur Sistem', 'Pemetaan Risiko Teknis', 'Estimasi Biaya & Jadwal Tetap'],
  },
  {
    number: '02',
    title: 'Prototyping',
    duration: '2–3 Minggu',
    description:
      'Pembuatan purwarupa interaktif antarmuka UI sekaligus uji coba rangkaian sensor atau simulasi kinematika sebelum produksi penuh.',
    deliverables: ['Desain UI/UX Interaktif', 'Proof-of-Concept Hardware/IoT', 'Validasi Pengguna Awal'],
  },
  {
    number: '03',
    title: 'Pengembangan & Integrasi',
    duration: '4–10 Minggu',
    description:
      'Pengembangan perangkat lunak, firmware, dan perangkat mekanik secara paralel dengan demo kemajuan setiap dua minggu.',
    deliverables: ['Kode Produksi & Firmware Teruji', 'Integrasi API & Protokol Mesin', 'Uji Beban & Keamanan'],
  },
  {
    number: '04',
    title: 'Deployment & Maintenance',
    duration: 'Berkelanjutan',
    description:
      'Instalasi di lokasi atau server produksi, pelatihan operator, serta dukungan pemeliharaan SLA dan pembaruan berkala.',
    deliverables: ['Pelatihan Tim Operasional', 'Dokumentasi Teknis Lengkap', 'Dukungan SLA & Monitoring'],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Apakah Sinergika bisa mengintegrasikan mesin atau sensor lama ke sistem baru?',
    answer:
      'Ya. Tim kami terbiasa membangun bridge dan gateway khusus untuk protokol industri seperti Modbus RTU/TCP, RS-485, CAN bus, maupun OPC-UA sehingga perangkat keras lama tetap bisa dibaca dari dashboard modern tanpa mengganti seluruh mesin.',
  },
  {
    id: 'faq-2',
    question: 'Bagaimana kepemilikan kode sumber (source code) dan desain perangkat keras setelah proyek selesai?',
    answer:
      'Seluruh hak kekayaan intelektual—termasuk repositori kode sumber, skematik PCB, firmware, dan dokumentasi teknis—sepenuhnya menjadi milik perusahaan Anda setelah serah terima proyek.',
  },
  {
    id: 'faq-3',
    question: 'Berapa lama waktu pengembangan proyek custom software atau sistem IoT?',
    answer:
      'Proyek aplikasi web atau dashboard operasional umumnya memakan waktu 6–10 minggu hingga peluncuran awal. Untuk sistem yang melibatkan fabrikasi PCB khusus atau integrasi lengan robotik, durasi berkisar 10–16 minggu termasuk uji coba lapangan.',
  },
  {
    id: 'faq-4',
    question: 'Apakah kami bisa memulai dari fase Proof of Concept (PoC) terlebih dahulu?',
    answer:
      'Sangat disarankan untuk proyek dengan kompleksitas perangkat keras tinggi. Anda dapat memulai dari fase 01 dan 02 untuk memvalidasi kelayakan teknis dan ROI di satu lini produksi sebelum melakukan ekspansi ke seluruh fasilitas.',
  },
  {
    id: 'faq-5',
    question: 'Bagaimana skema pemeliharaan dan dukungan teknis setelah sistem berjalan?',
    answer:
      'Setiap proyek mencakup masa garansi perbaikan bug serta opsi kontrak pemeliharaan (SLA) bulanan yang mencakup pemantauan server, pembaruan keamanan firmware Over-The-Air (OTA), dan dukungan teknis prioritas.',
  },
];
