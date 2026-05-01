import { Component, computed, inject, ViewChild } from '@angular/core';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { NgFor } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

interface KpiStats {
  title: string;
  value: string;
  trend: number;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, NgFor],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Monitor your key metrics and overall platform performance.</p>
        </div>
        <div class="hidden sm:flex gap-2">
          <button class="px-4 py-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Last 30 Days
          </button>
          <button class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-2">
            <span class="material-icons-outlined text-sm">download</span> Export
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of kpiStats" class="card relative overflow-hidden group hover:border-primary-500/50 transition-colors">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.title }}</p>
              <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stat.value }}</p>
            </div>
            <div [class]="'p-3 rounded-xl ' + stat.colorClass">
              <span class="material-icons-outlined">{{ stat.icon }}</span>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="flex items-center gap-1 font-medium" [class.text-emerald-500]="stat.trend > 0" [class.text-red-500]="stat.trend < 0">
              <span class="material-icons-outlined text-sm">{{ stat.trend > 0 ? 'trending_up' : 'trending_down' }}</span>
              {{ Math.abs(stat.trend) }}%
            </span>
            <span class="text-slate-500 dark:text-slate-400 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Revenue Line Chart -->
        <div class="card lg:col-span-2">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
            <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <span class="material-icons-outlined">more_vert</span>
            </button>
          </div>
          <apx-chart
            [series]="revenueChartOptions().series!"
            [chart]="revenueChartOptions().chart!"
            [xaxis]="revenueChartOptions().xaxis!"
            [stroke]="revenueChartOptions().stroke!"
            [colors]="revenueChartOptions().colors!"
            [dataLabels]="revenueChartOptions().dataLabels!"
            [grid]="revenueChartOptions().grid!"
            [tooltip]="revenueChartOptions().tooltip!"
            [theme]="revenueChartOptions().theme!"
          ></apx-chart>
        </div>

        <!-- Demographics Doughnut Chart -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-slate-900 dark:text-white">User Devices</h3>
            <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <span class="material-icons-outlined">more_vert</span>
            </button>
          </div>
          <apx-chart
            [series]="deviceChartOptions().series!"
            [chart]="deviceChartOptions().chart!"
            [labels]="deviceChartOptions().labels!"
            [colors]="deviceChartOptions().colors!"
            [plotOptions]="deviceChartOptions().plotOptions!"
            [dataLabels]="deviceChartOptions().dataLabels!"
            [stroke]="deviceChartOptions().stroke!"
            [legend]="deviceChartOptions().legend!"
            [theme]="deviceChartOptions().theme!"
          ></apx-chart>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  themeService = inject(ThemeService);
  Math = Math;

  kpiStats: KpiStats[] = [
    { title: 'Total Revenue', value: '$84,590', trend: 12.5, icon: 'payments', colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
    { title: 'Total Users', value: '12,480', trend: 8.2, icon: 'people', colorClass: 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400' },
    { title: 'Active Sessions', value: '1,420', trend: -2.4, icon: 'local_fire_department', colorClass: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' },
    { title: 'Bounce Rate', value: '24.5%', trend: 4.1, icon: 'call_split', colorClass: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
  ];

  // Dynamically compute chart options so they react to Theme changes
  revenueChartOptions = computed((): Partial<ApexOptions> => {
    const isDark = this.themeService.isDarkMode();
    const textColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 / slate-500
    const borderColor = isDark ? '#334155' : '#f1f5f9'; // dark-border / slate-100

    return {
      series: [
        { name: 'Current Month', data: [3100, 4000, 2800, 5100, 4200, 10900, 10000] },
        { name: 'Previous Month', data: [2100, 2600, 2200, 3400, 2800, 5200, 4100] }
      ],
      chart: { height: 350, type: 'area', fontFamily: 'Inter, sans-serif', toolbar: { show: false }, background: 'transparent' },
      colors: ['#0ea5e9', '#94a3b8'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: { style: { colors: textColor } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      grid: { borderColor: borderColor, strokeDashArray: 4, yaxis: { lines: { show: true } } },
      tooltip: { theme: isDark ? 'dark' : 'light' },
      theme: { mode: isDark ? 'dark' : 'light' }
    };
  });

  deviceChartOptions = computed((): Partial<ApexOptions> => {
    const isDark = this.themeService.isDarkMode();
    const strokeColor = isDark ? '#1e293b' : '#ffffff'; // dark-surface / white
    const textColor = isDark ? '#94a3b8' : '#64748b';

    return {
      series: [55, 30, 15],
      chart: { type: 'donut', height: 350, fontFamily: 'Inter, sans-serif', background: 'transparent' },
      labels: ['Desktop', 'Mobile', 'Tablet'],
      colors: ['#0ea5e9', '#8b5cf6', '#10b981'],
      stroke: { colors: [strokeColor], width: 2 },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: { color: textColor },
              value: { color: isDark ? '#ffffff' : '#0f172a', fontSize: '24px', fontWeight: 600, formatter: (val) => val + '%' }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      legend: { position: 'bottom', labels: { colors: textColor } },
      theme: { mode: isDark ? 'dark' : 'light' }
    };
  });
}
