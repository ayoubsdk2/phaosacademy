import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseProgress } from '@/hooks/useSupabaseProgress';
import { AcademySidebar } from '@/components/academy/AcademySidebar';
import { AcademyNavbar } from '@/components/academy/AcademyNavbar';
import { DashboardView } from '@/components/academy/DashboardView';
import { ModuleViewer } from '@/components/academy/ModuleViewer';
import { OnboardingTour } from '@/components/academy/OnboardingTour';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user, profile, isManager, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewUserId = searchParams.get('viewUser');
  const viewUserName = searchParams.get('viewName') ? decodeURIComponent(searchParams.get('viewName')!) : null;
  const academy = useSupabaseProgress(user, isManager, viewUserId || undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [replayTour, setReplayTour] = useState(false);

  // Audit log: record every time a manager opens a Student View. Fire-and-forget.
  useEffect(() => {
    if (!isManager || !viewUserId || !user) return;
    supabase
      .from('manager_actions')
      .insert({
        manager_id: user.id,
        action: 'student_view_open',
        target_user_id: viewUserId,
        metadata: { student_name: viewUserName ?? null },
      })
      .then(() => {}, () => {});
  }, [isManager, viewUserId, user, viewUserName]);

  const clearStudentView = () => {
    setSearchParams({});
  };

  if (!academy.loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (academy.loadError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-destructive text-2xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Couldn't load your progress</h1>
          <p className="text-sm text-muted-foreground">{academy.loadError}. Check your connection and try again.</p>
          <button
            onClick={academy.retryLoad}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userEmail = user?.email || '';

  return (
    <div className="min-h-screen bg-background flex">
      <AcademySidebar
        weeks={academy.weeks}
        activeDay={academy.activeDay}
        completedModules={academy.completedModules}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
        onDayClick={(dayId) => {
          academy.setActiveDay(dayId);
          academy.navigateToModule(dayId, 0);
        }}
        onModuleClick={(dayId, moduleIndex) => {
          academy.navigateToModule(dayId, moduleIndex);
        }}
        reviewScores={academy.reviewScores}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AcademyNavbar
          view={academy.view}
          setView={(v) => { if (viewUserId && v === 'module') { academy.setView('module'); } else { academy.setView(v); } }}
          xp={viewUserId ? academy.xp : academy.xp}
          level={viewUserId ? academy.level : academy.level}
          onMenuClick={() => setSidebarCollapsed(prev => !prev)}
          activeBrand={academy.activeBrand}
          userName={viewUserId ? viewUserName || 'Student' : profile?.full_name}
          isManager={isManager}
          onSignOut={viewUserId ? undefined : signOut}
          viewingStudent={viewUserId ? (viewUserName || 'Student') : undefined}
          onClearStudentView={viewUserId ? clearStudentView : undefined}
          onReplayTour={viewUserId ? undefined : () => setReplayTour(true)}
        />

        <main className="flex-1 overflow-y-auto scrollbar-thin p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {academy.view === 'dashboard' ? (
              <DashboardView
                key="dashboard"
                progressPercent={academy.progressPercent}
                completedCount={academy.completedModules.size}
                totalModules={academy.totalModules}
                badges={academy.badges}
                onContinue={academy.continueFromCurrent}
                brandProgress={academy.brandProgress}
                userName={viewUserId ? (viewUserName || 'Student') : profile?.full_name}
              />
            ) : academy.currentDay && academy.currentModule ? (
              <ModuleViewer
                key={`module-${academy.currentModule.id}`}
                day={academy.currentDay}
                moduleIndex={academy.activeModuleIndex}
                module={academy.currentModule}
                completedModules={academy.completedModules}
                dayProgress={academy.dayProgress}
                onComplete={academy.completeModule}
                onNext={academy.nextModule}
                onPrev={academy.prevModule}
                isGraduation={academy.currentDay.isGraduation}
                reviewScores={academy.reviewScores}
                onReviewScore={academy.setReviewScore}
                userEmail={userEmail}
                onSaveTowerScore={academy.saveTowerScore}
              />
            ) : null}
          </AnimatePresence>
        </main>
      </div>

      {!viewUserId && (
        <OnboardingTour
          userId={user?.id}
          alreadyCompleted={Boolean((profile as any)?.onboarding_completed_at)}
          forceOpen={replayTour}
          onClose={() => setReplayTour(false)}
        />
      )}
    </div>
  );
};

export default Index;
