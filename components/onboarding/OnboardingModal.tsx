
import React, { useState, useLayoutEffect, useRef } from 'react';

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const tourSteps = [
  {
    targetId: null,
    title: 'Bem-vindo ao Wallet SATTI!',
    content: 'Este é um tour rápido para te apresentar as principais funcionalidades do aplicativo. Vamos começar?',
  },
  {
    targetId: 'dashboard-tab',
    title: 'Painel Principal',
    content: 'Aqui você tem uma visão geral da sua saúde financeira, com balanços mensais, gráficos de fluxo e saldo acumulado.',
  },
  {
    targetId: 'dashboard-balance-card',
    title: 'Balanço do Mês',
    content: 'Acompanhe rapidamente o total de receitas, despesas e o saldo do mês selecionado.',
  },
  {
    targetId: 'transactions-tab',
    title: 'Lançamentos',
    content: 'Nesta aba, você pode visualizar, filtrar e gerenciar todas as suas transações, passadas e futuras.',
  },
  {
    targetId: 'add-button',
    title: 'Adicionar Lançamento',
    content: 'Use este botão central para adicionar novas receitas ou despesas de forma rápida e fácil.',
  },
  {
    targetId: 'savings-tab',
    title: 'Metas de Poupança',
    content: 'Crie e acompanhe suas metas financeiras, seja para uma viagem, um bem ou uma reserva de emergência.',
  },
  {
    targetId: 'budgets-tab',
    title: 'Orçamentos',
    content: 'Defina orçamentos mensais por categoria para manter seus gastos sob controle e evitar surpresas.',
  },
  {
    targetId: 'reports-tab',
    title: 'Relatórios Detalhados',
    content: 'Para uma análise mais profunda, explore relatórios, projeções e exporte seus dados.',
  },
  {
    targetId: 'settings-tab',
    title: 'Configurações',
    content: 'Personalize o aplicativo, gerencie suas categorias, altere a moeda e muito mais.',
  },
  {
    targetId: null,
    title: 'Tudo Pronto!',
    content: 'Você completou o tour. Agora é sua vez! Comece adicionando seu primeiro lançamento e tome o controle de suas finanças.',
  },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

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
                    <button onClick={goPrev} className="px-4 py-2 text-sm rounded-lg hover:bg-zinc-700">Anterior</button>
                )}
                <button onClick={goNext} className="px-4 py-2 text-sm rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
                    {isLastStep ? 'Finalizar' : isFirstStep ? 'Começar' : 'Próximo'}
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
