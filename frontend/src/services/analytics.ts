interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

class AnalyticsService {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NEXT_PUBLIC_GA_ID !== undefined;
  }

  track(event: AnalyticsEvent): void {
    if (!this.isEnabled) {
      console.log('Analytics Event (Dev):', event);
      return;
    }

    // Google Analytics 4 event tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }

  // Subject events
  trackSubjectCreated(subjectName: string): void {
    this.track({
      action: 'subject_created',
      category: 'Subject Management',
      label: subjectName,
    });
  }

  trackSubjectUpdated(subjectId: number): void {
    this.track({
      action: 'subject_updated',
      category: 'Subject Management',
      label: `Subject ${subjectId}`,
    });
  }

  trackSubjectDeleted(subjectId: number): void {
    this.track({
      action: 'subject_deleted',
      category: 'Subject Management',
      label: `Subject ${subjectId}`,
    });
  }

  trackSubjectViewed(subjectId: number): void {
    this.track({
      action: 'subject_viewed',
      category: 'Subject Management',
      label: `Subject ${subjectId}`,
    });
  }

  // Competency events
  trackCompetencyCreated(competencyName: string, marks: number): void {
    this.track({
      action: 'competency_created',
      category: 'Competency Management',
      label: competencyName,
      value: marks,
    });
  }

  trackCompetencyUpdated(competencyId: number): void {
    this.track({
      action: 'competency_updated',
      category: 'Competency Management',
      label: `Competency ${competencyId}`,
    });
  }

  trackCompetencyDeleted(competencyId: number): void {
    this.track({
      action: 'competency_deleted',
      category: 'Competency Management',
      label: `Competency ${competencyId}`,
    });
  }

  // UI events
  trackButtonClick(buttonName: string, location: string): void {
    this.track({
      action: 'button_click',
      category: 'UI Interaction',
      label: `${buttonName} - ${location}`,
    });
  }

  trackModalOpen(modalName: string): void {
    this.track({
      action: 'modal_open',
      category: 'UI Interaction',
      label: modalName,
    });
  }

  trackModalClose(modalName: string): void {
    this.track({
      action: 'modal_close',
      category: 'UI Interaction',
      label: modalName,
    });
  }

  trackPageView(pageName: string): void {
    this.track({
      action: 'page_view',
      category: 'Navigation',
      label: pageName,
    });
  }
}

export const analytics = new AnalyticsService();