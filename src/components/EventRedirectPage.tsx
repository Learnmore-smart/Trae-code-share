import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOriginalUrl, flagEvent } from '../services/eventService';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const EventRedirectPage = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isFlagging, setIsFlagging] = useState(false);
  const [showFlagOption, setShowFlagOption] = useState(false);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (!id) return;

      try {
        const data = await getOriginalUrl(id);

        if (data.isDisabled) {
          setIsDisabled(true);
          setOriginalUrl(data.originalUrl);
          toast.warning('此链接已被报告为已使用');
          return;
        }

        setOriginalUrl(data.originalUrl);
        // Show flag option briefly before redirect
        setShowFlagOption(true);

        // Redirect after a short delay to allow flagging
        setTimeout(() => {
          if (data.originalUrl) {
            window.location.href = data.originalUrl;
          }
        }, 2000);
      } catch (err: any) {
        console.error(err);
        setError(err.message || '找不到活动链接');
        toast.error('链接无效或已过期');
      }
    };

    fetchAndRedirect();
  }, [id]);

  const handleFlag = async () => {
    if (!id) return;
    setIsFlagging(true);
    try {
      const result = await flagEvent(id);
      toast.success('已标记为已使用，感谢您的反馈！');
      if (result.isDisabled) {
        setIsDisabled(true);
      }
    } catch (err: any) {
      toast.error(err.message || '标记失败');
    } finally {
      setIsFlagging(false);
    }
  };

  const handleContinueAnyway = () => {
    if (originalUrl) {
      window.location.href = originalUrl;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 shadow-2xl">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">链接错误</h2>
            <p className="text-slate-600 dark:text-slate-300">
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show disabled state - link has been flagged too many times
  if (isDisabled) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-amber-200 dark:border-amber-900 bg-white dark:bg-slate-900 shadow-2xl">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">链接已被报告为已使用</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              此活动链接已被多位用户报告为已使用，可能已失效。
            </p>
            <div className="pt-2 space-y-2">
              <Button
                onClick={handleContinueAnyway}
                variant="outline"
                className="w-full"
              >
                仍然尝试 →
              </Button>
              <a href="/code-share/" className="block text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                ← 返回首页
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
          <div className="relative w-24 h-24 bg-white dark:bg-slate-900 rounded-full shadow-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
             <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Trae 活动
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            正在跳转到您的活动...
          </p>
        </div>

        <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-indigo-600 w-1/2 animate-indeterminate-bar rounded-full"></div>
        </div>

        {showFlagOption && (
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3">
            <p className="text-xs text-slate-400">使用后请点击下方按钮标记，帮助抑制黄牛</p>
            <Button
              variant="default"
              size="sm"
              onClick={handleFlag}
              disabled={isFlagging}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
            >
              {isFlagging ? '标记中...' : '🚩 已使用？点击标记此链接'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
