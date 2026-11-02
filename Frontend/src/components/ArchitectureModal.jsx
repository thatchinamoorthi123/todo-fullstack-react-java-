import React, { useState } from 'react';
import { X, Activity, Server, Database, Code, BookOpen, ArrowRight, CheckCircle2, Copy } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose, apiLogs = [] }) {
  const [activeTab, setActiveTab] = useState('flow');
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const curlSnippets = [
    {
      title: 'Get All Todos',
      cmd: 'curl -X GET http://localhost:8080/api/todos',
    },
    {
      title: 'Create a New Todo',
      cmd: `curl -X POST http://localhost:8080/api/todos -H "Content-Type: application/json" -d '{"title":"Study Spring Boot JPA","description":"Learn repository interfaces","priority":"HIGH","category":"Study"}'`,
    },
    {
      title: 'Toggle Todo Completion',
      cmd: 'curl -X PATCH http://localhost:8080/api/todos/1/toggle',
    },
    {
      title: 'Delete a Todo',
      cmd: 'curl -X DELETE http://localhost:8080/api/todos/1',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow Line */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Full Stack Architecture & REST API Guide</h2>
              <p className="text-xs text-slate-400">
                How React frontend and Java Spring Boot backend connect and communicate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 gap-4">
          <button
            onClick={() => setActiveTab('flow')}
            className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'flow'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            Architecture Flow
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Live API Logs ({apiLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'curl'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            cURL & REST Testing
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {activeTab === 'flow' && (
            <div className="space-y-6">
              {/* Architecture Diagram */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Request-Response Lifecycle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1: Frontend */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                          1
                        </span>
                        <h4 className="font-semibold text-white">React Frontend</h4>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        Running on <code className="text-indigo-300">http://localhost:5173</code>
                      </p>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                        <li>User clicks button (e.g. toggle, add)</li>
                        <li>Triggers <code className="text-indigo-300">fetch('/api/todos')</code></li>
                        <li>Handles JSON response & updates UI state</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 2: Spring Boot Backend */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                          2
                        </span>
                        <h4 className="font-semibold text-white">Java Spring Boot</h4>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        Running on <code className="text-purple-300">http://localhost:8080</code>
                      </p>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                        <li><code className="text-purple-300">@RestController</code> receives HTTP call</li>
                        <li>CORS allows port 5173</li>
                        <li>Spring Data JPA performs DB query</li>
                        <li>Serializes entity to JSON</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 3: Database */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          3
                        </span>
                        <h4 className="font-semibold text-white">Database (PostgreSQL)</h4>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        Port <code className="text-emerald-300">5432</code> (table: <code className="text-emerald-300">todos</code>)
                      </p>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                        <li>Hibernate manages SQL DDL/DML</li>
                        <li>Auto-creates columns & indexes</li>
                        <li>Persistent across server restarts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Why is CORS needed?
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Browsers enforce the <strong>Same-Origin Policy</strong>. Because React runs on{' '}
                    <code className="text-indigo-300">localhost:5173</code> and Spring Boot runs on{' '}
                    <code className="text-purple-300">localhost:8080</code>, they have different ports (different origins).
                    In <code className="text-indigo-300">CorsConfig.java</code>, we registered{' '}
                    <code className="text-indigo-300">allowedOrigins("http://localhost:5173")</code> so the browser allows React to fetch data seamlessly.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Key Spring Annotations
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-1.5">
                    <li><strong className="text-slate-200">@RestController</strong>: Marks class as handling REST API and returning JSON.</li>
                    <li><strong className="text-slate-200">@RequestMapping("/api/todos")</strong>: Base URL path for all endpoints.</li>
                    <li><strong className="text-slate-200">@GetMapping / @PostMapping</strong>: Maps HTTP GET and POST requests.</li>
                    <li><strong className="text-slate-200">@Entity</strong>: Maps Java class directly to database table.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Real-time activity recorded each time your React UI interacts with the Spring Boot REST API:
              </p>
              {apiLogs.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs">
                  No API calls recorded yet. Interact with tasks or reload to see requests!
                </div>
              ) : (
                <div className="space-y-2">
                  {apiLogs.map((log) => {
                    const isSuccess = log.status >= 200 && log.status < 300;
                    return (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              log.method === 'GET'
                                ? 'bg-blue-500/20 text-blue-400'
                                : log.method === 'POST'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : log.method === 'PATCH' || log.method === 'PUT'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {log.method}
                          </span>
                          <span className="text-white font-medium">{log.endpoint}</span>
                          <span className="text-slate-500">({log.action})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{log.duration}</span>
                          <span
                            className={`px-2 py-0.5 rounded ${
                              isSuccess
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {log.status}
                          </span>
                          <span className="text-slate-600 text-[10px]">{log.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'curl' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                You can test the Spring Boot REST endpoints directly in PowerShell or terminal using these commands:
              </p>
              {curlSnippets.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                    <button
                      onClick={() => copyToClipboard(item.cmd, idx)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-700 transition cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                    {item.cmd}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
