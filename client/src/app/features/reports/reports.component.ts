import { Component, inject, ElementRef, ViewChild, computed, effect } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { NgApexchartsModule, ApexOptions, ApexAxisChartSeries, ApexNonAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexStroke, ApexTooltip, ApexFill, ApexGrid, ApexLegend, ApexDataLabels, ApexPlotOptions, ApexMarkers } from 'ng-apexcharts';
import { interval, map, startWith } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, AsyncPipe],
  template: `
    <div #reportContent class="space-y-6 pb-12 p-4 bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <!-- Header -->
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Analytics</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Deep dive into platform usage, revenue, and system performance.</p>
        </div>
        <div class="flex gap-2">
          <button (click)="themeService.toggleTheme()" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold transition-all text-slate-700 dark:text-slate-200">
            <span class="material-icons-outlined text-xl">{{ themeService.isDarkMode() ? 'dark_mode' : 'light_mode' }}</span>
            {{ themeService.isDarkMode() ? 'Dark' : 'Light' }}
          </button>
          <button (click)="downloadReport()" class="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg text-sm font-medium shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2">
            <span class="material-icons-outlined text-sm">picture_as_pdf</span>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Real-time Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Live Active Users</p>
              <p class="text-4xl font-bold mt-2 text-slate-900 dark:text-white">{{ liveUsers$ | async }}</p>
            </div>
            <div class="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <span class="material-icons-outlined text-primary-600 dark:text-primary-400">sensors</span>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time updates every 3 seconds
          </div>
        </div>

        <div class="card lg:col-span-2 p-0 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
            <h3 class="font-bold text-slate-900 dark:text-white">System Resource Usage</h3>
            <div class="flex gap-4">
              <div class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span class="w-2 h-2 rounded-full bg-primary-500"></span> CPU
              </div>
              <div class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span> RAM
              </div>
            </div>
          </div>
          <div class="h-[120px] w-full">
            <apx-chart
              [series]="performanceSeries"
              [chart]="performanceChart"
              [stroke]="performanceStroke"
              [colors]="performanceColors"
              [fill]="performanceFill"
              [grid]="performanceGrid"
              [xaxis]="performanceXaxis"
              [yaxis]="performanceYaxis"
              [tooltip]="performanceTooltip"
              [theme]="chartTheme()"
            ></apx-chart>
          </div>
        </div>
      </div>

      <!-- Advanced Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- User Demographics -->
        <div class="card">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">User Demographics</h3>
          <div class="h-[300px]">
            <apx-chart
              [series]="radarSeries"
              [chart]="radarChart"
              [xaxis]="radarXaxis"
              [colors]="radarColors"
              [stroke]="radarStroke"
              [markers]="radarMarkers"
              [fill]="radarFill"
              [yaxis]="radarYaxis"
              [legend]="radarLegend"
              [theme]="chartTheme()"
            ></apx-chart>
          </div>
        </div>

        <!-- Revenue Distribution -->
        <div class="card">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Distribution</h3>
          <div class="h-[300px]">
            <apx-chart
              [series]="donutSeries"
              [chart]="donutChart"
              [labels]="donutLabels"
              [colors]="donutColors"
              [legend]="donutLegend"
              [dataLabels]="donutDataLabels"
              [plotOptions]="donutPlotOptions"
              [stroke]="donutStroke"
              [theme]="chartTheme()"
            ></apx-chart>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ReportsComponent {
  public themeService = inject(ThemeService);
  private notify = inject(NotificationService);

  @ViewChild('reportContent') reportContent!: ElementRef;

  // Computed Theme Options
  chartTheme = computed(() => ({
    mode: (this.themeService.isDarkMode() ? 'dark' : 'light') as 'dark' | 'light',
    palette: 'palette1'
  }));

  // Live Users Simulation
  liveUsers$ = interval(3000).pipe(
    startWith(0),
    map(() => Math.floor(Math.random() * (1250 - 1100 + 1) + 1100))
  );

  // 1. Performance Sparkline Chart
  performanceSeries: ApexAxisChartSeries = [
    { name: 'CPU', data: [31, 40, 28, 51, 42, 109, 100] },
    { name: 'RAM', data: [11, 32, 45, 32, 34, 52, 41] }
  ];
  performanceChart: ApexChart = {
    type: 'area',
    height: 120,
    sparkline: { enabled: true },
    animations: { 
      enabled: true, 
      dynamicAnimation: { enabled: true, speed: 800 } 
    }
  };
  performanceStroke: ApexStroke = { curve: 'smooth', width: 2 };
  performanceColors: string[] = ['#6366f1', '#10b981'];
  performanceFill: ApexFill = {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 }
  };
  performanceGrid: ApexGrid = { padding: { top: 0, right: 0, bottom: 0, left: 0 } };
  performanceXaxis: ApexXAxis = { crosshairs: { show: false } };
  performanceYaxis: ApexYAxis = { min: 0 };
  performanceTooltip: ApexTooltip = { 
    theme: this.themeService.isDarkMode() ? 'dark' : 'light' 
  };

  // 2. Radar Chart (User Demographics)
  radarSeries: ApexAxisChartSeries = [
    { name: '2023', data: [80, 50, 30, 40, 100, 20] },
    { name: '2024', data: [20, 30, 40, 80, 20, 80] }
  ];
  radarChart: ApexChart = { 
    height: 300, 
    type: 'radar', 
    toolbar: { show: false },
    sparkline: { enabled: false }
  };
  radarColors: string[] = ['#6366f1', '#10b981'];
  radarStroke: ApexStroke = { width: 2 };
  radarFill: ApexFill = { opacity: 0.1 };
  radarMarkers: ApexMarkers = { size: 0 };
  
  radarXaxis: ApexXAxis = { 
    categories: ['Age 18-24', 'Age 25-34', 'Age 35-44', 'Age 45-54', 'Age 55+', 'Students'],
  };
  radarYaxis: ApexYAxis = { show: false };

  // 3. Donut Chart (Revenue)
  donutSeries: ApexNonAxisChartSeries = [44, 55, 13, 33];
  donutChart: ApexChart = { type: 'donut', height: 300 };
  donutLabels: string[] = ['Subscriptions', 'Ad Revenue', 'Affiliates', 'Marketplace'];
  donutColors: string[] = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
  donutLegend: ApexLegend = { position: 'bottom' };
  donutDataLabels: ApexDataLabels = { enabled: false };
  donutStroke: ApexStroke = { show: false };
  donutPlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Revenue',
            formatter: () => '$145k'
          }
        }
      }
    }
  };

  constructor() {
    effect(() => {
      const isDark = this.themeService.isDarkMode();
      this.updateChartOptions(isDark);
    });
  }

  private updateChartOptions(isDark: boolean) {
    const textColor = isDark ? '#f8fafc' : '#475569';
    const totalColor = isDark ? '#ffffff' : '#1e293b';

    // Update Radar Chart Options
    this.radarXaxis = {
      ...this.radarXaxis,
      labels: {
        show: true,
        style: {
          colors: Array(6).fill(textColor),
          fontSize: '11px',
          fontWeight: 600
        }
      }
    };

    // Update Donut Chart Options
    this.donutPlotOptions = {
      ...this.donutPlotOptions,
      pie: {
        ...this.donutPlotOptions?.pie,
        donut: {
          ...this.donutPlotOptions?.pie?.donut,
          labels: {
            ...this.donutPlotOptions?.pie?.donut?.labels,
            show: true,
            total: {
              show: true,
              label: 'Total Revenue',
              color: textColor,
              formatter: () => '$145k'
            },
            value: {
              show: true,
              color: totalColor,
              fontSize: '22px',
              fontWeight: 700,
              formatter: () => '$145k'
            }
          }
        }
      }
    };

    // Update Legend
    this.donutLegend = {
      ...this.donutLegend,
      labels: {
        colors: Array(4).fill(textColor)
      }
    };

    this.radarLegend = {
      show: true,
      position: 'bottom',
      labels: {
        colors: Array(2).fill(textColor)
      }
    };
  }

  radarLegend: ApexLegend = {
    show: true,
    position: 'bottom'
  };

  async downloadReport() {
    const element = this.reportContent.nativeElement;
    if (!element) return;

    this.notify.info('Preparing your PDF report...');

    try {
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: this.themeService.isDarkMode() ? '#0f172a' : '#f8fafc',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; 
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight > pageHeight ? imgHeight : pageHeight]);
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`Platform_Analytics_${new Date().toLocaleDateString()}.pdf`);
      this.notify.success('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      this.notify.error('Failed to generate PDF report.');
    }
  }
}
