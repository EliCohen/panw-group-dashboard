(function() {
  const { Component, NgModule } = ng.core;
  const { BrowserModule } = ng.platformBrowser;
  const { CommonModule } = ng.common;
  const { platformBrowserDynamic } = ng.platformBrowserDynamic;

  class AppComponent {
    constructor() {
      this.versionData = {
        name: 'Loading...',
        startDate: new Date(),
        endDate: new Date(),
        totalDays: 0,
        daysLeft: 0,
        progress: 0,
        milestones: [],
        branches: [],
      };

      this.drops = [];
      this.teams = [];
      this.birthdays = [
        { name: '', date: '', daysAway: '', image: '' },
        { name: '', date: '', daysAway: '', image: '' },
      ];

      this.activeSlide = 0;
    }

    ngOnInit() {
      this.loadConfig();

      this.timer = setInterval(() => {
        if (this.teams.length > 0) {
          this.activeSlide = (this.activeSlide + 1) % this.teams.length;
        }
      }, 10000);
    }

    ngOnDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }

    selectSlide(index) {
      this.activeSlide = index;
    }

    async loadConfig() {
      try {
        const response = await fetch('config.json', { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.versionData) {
          this.versionData = {
            ...data.versionData,
            startDate: new Date(data.versionData.startDate),
            endDate: new Date(data.versionData.endDate),
            milestones: Array.isArray(data.versionData.milestones) ? data.versionData.milestones : [],
            branches: Array.isArray(data.versionData.branches) ? data.versionData.branches : [],
          };
        }

        this.drops = Array.isArray(data.drops) ? data.drops : [];
        this.teams = Array.isArray(data.teams) ? data.teams : [];

        if (Array.isArray(data.birthdays) && data.birthdays.length >= 2) {
          this.birthdays = data.birthdays;
        }

        this.activeSlide = 0;
      } catch (error) {
        console.error('Failed to load configuration', error);
      }
    }
  }

  AppComponent.annotations = [
    new Component({
      selector: 'app-root',
      template: /* html */ `
        <div class="app-shell">
          <header class="card header">
            <div class="header-title">
              <div class="label">Current Version</div>
              <h1>{{ versionData.name }}</h1>
              <div class="branches" *ngIf="versionData.branches?.length">
                <div *ngFor="let branch of versionData.branches" class="branch-row">
                  <div class="branch-title">
                    {{ branch.title }}
                    <span class="branch-name">(Branch: {{ branch.branch }})</span>
                  </div>
                  <div class="branch-products">{{ branch.products }}</div>
                </div>
              </div>
              <div class="divider" aria-hidden="true"></div>
            </div>

              <div class="progress">
                <div class="progress-info">
                  <span>Release Progress</span>
                  <span style="color: var(--blue); font-weight: 800;">{{ versionData.progress }}%</span>
                </div>
                <div class="progress-bar" aria-label="Release progress">
                  <div class="progress-fill" [style.width.%]="versionData.progress"></div>
                </div>
              </div>

              <div class="milestones" *ngIf="versionData.milestones?.length">
                <div class="milestone-title">Key Dates</div>
                <div class="milestone-list">
                  <div class="milestone" *ngFor="let milestone of versionData.milestones">
                    <div class="milestone-name">{{ milestone.name }}</div>
                    <div class="milestone-date">{{ milestone.date }}</div>
                  </div>
                </div>
              </div>

              <div class="countdown">
                <span class="icon-circle" aria-hidden="true">${clockIcon()}</span>
                <div>
                <div class="number">{{ versionData.daysLeft }} DAYS</div>
                <div class="sub">Until Shipping</div>
              </div>
            </div>
          </header>

          <div class="grid">
            <aside class="sidebar">
              <section class="card roadmap">
                <h2 class="section-title">${calendarIcon()} Version Roadmap</h2>
                <div class="timeline">
                  <div *ngFor="let drop of drops" class="timeline-item" [ngClass]="drop.status">
                    <div class="dot" [ngClass]="drop.status">
                      <span *ngIf="drop.status === 'completed'">${checkIcon()}</span>
                    </div>
                    <div>
                      <h4>{{ drop.name }}</h4>
                      <p>{{ drop.date }}</p>
                      <span *ngIf="drop.status === 'current'" class="badge">Ongoing</span>
                    </div>
                  </div>
                </div>
              </section>
            </aside>

            <main class="main">
              <section class="card carousel">
                <div class="divider" aria-hidden="true"></div>
                <article *ngFor="let team of teams; let i = index" class="slide" [ngClass]="{ 'active': i === activeSlide }">
                  <div class="icon-circle" [style.borderColor]="team.borderColor">
                    ${usersIcon()}
                  </div>
                  <div class="team-pill">${usersMiniIcon()} {{ team.name }}</div>
                  <h2>Current Initiatives</h2>

                  <ul class="feature-list">
                    <li *ngFor="let feature of team.features" class="feature-item">
                      ${chevronIcon()}
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                </article>

                <div class="pagination">
                  <div *ngFor="let dot of teams; let i = index" class="page-dot" [ngClass]="{ 'active': i === activeSlide }" (click)="selectSlide(i)"></div>
                </div>
              </section>
            </main>

            <aside class="rightbar">
              <section class="card birthday-card">
                <div class="avatar">
                  <img [src]="birthdays[0].image" [alt]="birthdays[0].name" />
                  <div class="cake-icon">${cakeIcon()}</div>
                </div>
                <h3>Upcoming Birthday</h3>
                <p class="name">{{ birthdays[0].name }}</p>
                <p class="date">{{ birthdays[0].date }}</p>
                <div class="pill">In {{ birthdays[0].daysAway }} days! 🥳</div>

                <div class="next-up">
                  <span class="label">Up Next</span>
                  <div class="mini">
                    <img [src]="birthdays[1].image" [alt]="birthdays[1].name" width="36" height="36" style="border-radius: 999px; border: 1px solid #27272a;" />
                    <div>
                      <div>{{ birthdays[1].name }}</div>
                      <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.1em;">{{ birthdays[1].date }}</div>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          <footer class="footer">
            <div class="ticker">
              <span>• HIGH VELOCITY MODE ENABLED</span>
              <span style="margin-left: 0.75rem;">• {{ versionData.startDate | date: 'LLL d, y' }} → {{ versionData.endDate | date: 'LLL d, y' }}</span>
            </div>
            <div class="status">
              <span class="status-dot"></span>
              <span>SYSTEMS OPERATIONAL</span>
            </div>
          </footer>
        </div>
      `,
      styles: []
    })
  ];

  class AppModule {}

  AppModule.annotations = [
    new NgModule({
      declarations: [AppComponent],
      imports: [BrowserModule, CommonModule],
      bootstrap: [AppComponent],
    }),
  ];

  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));

  function iconBase(path, size = 24, stroke = 'currentColor') {
    return `
      <svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${path}
      </svg>
    `;
  }

  function calendarIcon() {
    return iconBase(`
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    `, 24, '#60a5fa');
  }

  function clockIcon() {
    return iconBase(`
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    `, 32, '#34d399');
  }

  function cakeIcon() {
    return iconBase(`
      <path d="M12 2v4"></path>
      <path d="M10 6h4"></path>
      <path d="M8 8h8a4 4 0 0 1 4 4v5H4v-5a4 4 0 0 1 4-4Z"></path>
      <path d="M4 14s1.5 2 4 2 4-2 4-2 1.5 2 4 2 4-2 4-2"></path>
    `, 24, '#fff');
  }

  function usersIcon() {
    return iconBase(`
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    `, 30, '#60a5fa');
  }

  function usersMiniIcon() {
    return iconBase(`
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
    `, 18, '#a1a1aa');
  }

  function chevronIcon() {
    return iconBase(`<polyline points="9 18 15 12 9 6"></polyline>`, 24, '#60a5fa');
  }

  function checkIcon() {
    return iconBase(`<polyline points="20 6 9 17 4 12"></polyline>`, 16, '#0b0b0f');
  }
})();
