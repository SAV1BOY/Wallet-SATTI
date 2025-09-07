
import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../LanguageProvider';

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, onComplete }) => {
  const { t } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const tourSteps = useMemo(() => [
    { targetId: null, title: t('onboarding.step1.title'), content: t('onboarding.step1.content') },
    { targetId: 'dashboard-tab', title: t('onboarding.step2.title'), content: t('onboarding.step2.content') },
    { targetId: 'dashboard-balance-card', title: t('onboarding.step3.title'), content: t('onboarding.step3.content') },
    { targetId: 'transactions-tab', title: t('onboarding.step4.title'), content: t('onboarding.step4.content') },
    { targetId: 'add-button', title: t('onboarding.step5.title'), content: t('onboarding.step5.content') },
    { targetId: 'savings-tab', title: t('onboarding.step6.title'), content: t('onboarding.step6.content') },
    { targetId: 'budgets-tab', title: t('onboarding.step7.title'), content: t('onboarding.step7.content') },
    { targetId: 'reports-tab', title: t('onboarding.step8.title'), content: t('onboarding.step8.content') },
    { targetId: 'settings-tab', title: t('onboarding.step9.title'), content: t('onboarding.step9.content') },
    { targetId: null, title: t('onboarding.step10.title'), content: t('onboarding.step10.content') }
  ], [t]);

  const currentStep = tourSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === tourSteps.length - 1;

  useLayoutEffect(() => {
    if (!open || !tooltipRef.current) return;

    const targetId = currentStep.targetId;
    const tooltipEl = tooltipRef.current;

    setTooltipStyle(prev => ({ ...prev, opacity: 0 }));
    
    const calculatePosition = () => {
      const element = targetId ? document.querySelector(`[data-tour-id="${targetId}"]`) : null;
      const targetRect = element?.getBoundingClientRect();

      if (targetRect && targetRect.width > 0 && targetRect.height > 0) {
        setSpotlightStyle({
          position: 'fixed',
          left: `${targetRect.left - 8}px`,
          top: `${targetRect.top - 8}px`,
          width: `${targetRect.width + 16}px`,
          height: `${targetRect.height + 16}px`,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 12px rgba(6, 182, 212, 0.8)',
          borderRadius: targetRect.width > 70 ? '1.25rem' : '9999px',
          transition: 'all 0.35s ease-in-out',
          pointerEvents: 'none',
          zIndex: 100,
        });
      } else {
        setSpotlightStyle({
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          transition: 'opacity 0.3s ease-in-out',
          zIndex: 100,
        });
      }

      const tooltipRect = tooltipEl.getBoundingClientRect();
      const margin = 16;

      let newTooltipStyle: React.CSSProperties = {
          position: 'fixed',
          zIndex: 101,
          transition: 'opacity 0.3s ease-in-out 0.2s, top 0.35s ease-in-out, left 0.35s ease-in-out, transform 0.35s ease-in-out',
          opacity: 1,
          maxWidth: `calc(100vw - ${margin * 2}px)`,
      };

      if (targetRect && tooltipRect.width > 0) {
        const spaceAbove = targetRect.top;
        const spaceBelow = window.innerHeight - targetRect.bottom;
        const onTop = spaceAbove > spaceBelow && spaceAbove > tooltipRect.height + margin;
        
        newTooltipStyle.top = onTop 
            ? `${targetRect.top - margin}px` 
            : `${targetRect.bottom + margin}px`;
        
        newTooltipStyle.transform = onTop ? 'translateY(-100%)' : 'translateY(0)';

        const idealLeft = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        const finalLeft = Math.max(
          margin,
          Math.min(idealLeft, window.innerWidth - tooltipRect.width - margin)
        );
        newTooltipStyle.left = `${finalLeft}px`;

      } else {
        newTooltipStyle.top = '50%';
        newTooltipStyle.left = '50%';
        newTooltipStyle.transform = 'translate(-50%, -50%)';
      }
      setTooltipStyle(newTooltipStyle);
    };

    if (targetId) {
        const element = document.querySelector(`[data-tour-id="${targetId}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            const scrollTimeout = setTimeout(calculatePosition, 350);
            return () => clearTimeout(scrollTimeout);
        }
    }
    
    const timer = setTimeout(calculatePosition, 50); 
    return () => clearTimeout(timer);

  }, [stepIndex, open, currentStep.targetId]);


  if (!open) return null;

  const goNext = () => {
    if (!isLastStep) {
      setStepIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  const goPrev = () => {
    if (!isFirstStep) {
      setStepIndex(i => i - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
        <div style={spotlightStyle} />
        
        <div 
            ref={tooltipRef}
            style={tooltipStyle}
            className="w-full max-w-sm rounded-2xl bg-zinc-800 text-zinc-100 shadow-2xl p-5"
        >
            <h3 className="text-lg font-bold text-cyan-300 mb-2">{currentStep.title}</h3>
            <p className="text-sm text-zinc-300 mb-5">{currentStep.content}</p>

            <div className="flex justify-between items-center">
                {isFirstStep ? <div /> : (
                    <button onClick={goPrev} className="px-4 py-2 text-sm rounded-lg hover:bg-zinc-700">{t('onboarding.previous')}</button>
                )}
                <button onClick={goNext} className="px-4 py-2 text-sm rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
                    {isLastStep ? t('onboarding.finish') : isFirstStep ? t('onboarding.start') : t('onboarding.next')}
                </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-5">
                {tourSteps.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === stepIndex ? 'bg-cyan-400 w-5' : 'bg-zinc-600 w-2'}`} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default OnboardingModal;
