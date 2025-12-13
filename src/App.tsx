import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { createEventLink, EventLink, getRecentEvents } from './services/eventService';
import { EventRedirectPage } from './components/EventRedirectPage';
import './App.css';

// Premium "Share Event" Page
const ShareEventPage = () => {
  const [eventUrl, setEventUrl] = useState<string>('');
  const [createdEventLink, setCreatedEventLink] = useState<EventLink | null>(null);
  const [recentEvents, setRecentEvents] = useState<EventLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadRecentEvents();
  }, []);

  const loadRecentEvents = async () => {
    try {
      const events = await getRecentEvents();
      setRecentEvents(events);
    } catch (error) {
       console.error("Failed to load events", error);
    }
  }

  const handleShareEvent = async () => {
    if (!eventUrl.trim()) {
      toast.error('Please enter a Trae event URL');
      return;
    }

    setIsLoading(true);
    try {
      const link = await createEventLink(eventUrl.trim());
      setCreatedEventLink(link);
      setEventUrl('');
      toast.success('Secure link created!');
      loadRecentEvents(); // Refresh list
    } catch (error: any) {
      console.error('Failed to share event:', error);
      toast.error(error.message || 'Failed to share event link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyEventLink = async (id: string) => {
    const fullUrl = `${window.location.origin}/events/s/${id}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Link copied to clipboard');
    } catch (error) {
       toast.error('Failed to copy link');
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-20 flex flex-col justify-center items-center relative z-10">

        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-block mb-4">
             <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-slate-300 backdrop-blur-md">
               Secure Event Sharing
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500">
            Trae Share
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-lg mx-auto leading-relaxed">
            Generate secure, trackable links for your Trae events.
            Protect your original URLs and gain insights.
          </p>
        </div>

        {/* Input Card */}
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 mb-24">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <Card className="relative border-0 bg-slate-950/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">
              <CardContent className="p-2 sm:p-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      </svg>
                    </div>
                    <Input
                      placeholder="Paste your Trae event link (https://www.trae.com.cn/events/s/...)"
                      value={eventUrl}
                      onChange={(e) => setEventUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleShareEvent()}
                      className="w-full pl-10 h-14 bg-white/5 border-transparent text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:bg-white/10 transition-all rounded-xl text-lg font-medium"
                    />
                  </div>
                  <Button
                    onClick={handleShareEvent}
                    disabled={isLoading || !eventUrl.includes('trae.com.cn')}
                    className="h-14 px-8 rounded-xl bg-white text-black hover:bg-slate-200 font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Generate'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Result Card */}
          {createdEventLink && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                       <p className="text-sm font-medium text-slate-400">Your secure tracked link</p>
                       <code className="block text-xl font-mono text-indigo-300 break-all">
                          {window.location.origin}/events/s/{createdEventLink.id}
                       </code>
                    </div>
                    <Button
                      onClick={() => handleCopyEventLink(createdEventLink.id)}
                      className="shrink-0 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg"
                    >
                      Copy Link
                    </Button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Latest Events Grid */}
        <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 mb-20">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Latest Shared Events</h2>
              <span className="text-sm text-slate-500">{recentEvents.length} links</span>
           </div>

           {recentEvents.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-slate-500">No events shared yet. Be the first!</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentEvents.map((event) => (
                  <Card key={event.id} className="group bg-slate-900/50 border-white/5 hover:border-indigo-500/30 transition-all hover:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6">
                       <div className="flex items-start justify-between mb-4">
                          <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                            </svg>
                          </div>
                          <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-emerald-500/50"></span>
                             {event.viewCount} views
                          </div>
                       </div>

                       <div className="mb-6 space-y-2">
                           <div className="flex items-center gap-2">
                             <h3 className="font-semibold text-white/90 truncate">Trae Event</h3>
                             {event.isDisabled && (
                               <span className="px-1.5 py-0.5 text-[10px] bg-red-500/20 text-red-400 rounded">USED</span>
                             )}
                             {!event.isDisabled && event.flagCount > 0 && (
                               <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">
                                 {event.flagCount} 🚩
                               </span>
                             )}
                           </div>
                           <p className="text-xs text-slate-500 truncate font-mono bg-black/30 p-1.5 rounded">
                             {event.originalUrl}
                           </p>
                           <p className="text-xs text-slate-600 pt-2">
                             Shared {new Date(event.createdAt).toLocaleDateString()}
                           </p>
                       </div>

                       <div className="flex gap-2">
                          <a
                             href={`/events/s/${event.id}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                               event.isDisabled 
                                 ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                                 : 'bg-white text-black hover:bg-slate-200'
                             }`}
                          >
                             {event.isDisabled ? 'Reported Used' : 'Open Event'}
                          </a>
                          <Button
                             onClick={() => handleCopyEventLink(event.id)}
                             variant="outline"
                             className="px-3 border-white/10 hover:bg-white/5 text-slate-300"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2v2h-4V5z" /></svg>
                          </Button>
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
           )}
        </div>

        {/* Decorative Footer */}
        <div className="pb-16 text-center">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold opacity-50">
            Powered by Vercel & Trae
          </p>
        </div>

      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShareEventPage />} />
      <Route path="/events/s/:id" element={<EventRedirectPage />} />
    </Routes>
  );
}

export default App;