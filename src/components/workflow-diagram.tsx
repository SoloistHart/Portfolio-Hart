"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Sparkles,
  Image as ImageIcon,
  Video,
  Share2,
  Database,
  BarChart3,
  FileText,
  Globe,
  Layers,
  Zap,
  Send,
  Webhook,
  FileSpreadsheet,
  Filter,
  Brain,
  Mail,
  MessageSquare,
  Calendar,
  AlertCircle,
  Activity,
  Type,
  Bell,
} from "lucide-react";
import type { Workflow } from "@/lib/portfolio-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  sparkles: Sparkles,
  image: ImageIcon,
  video: Video,
  share2: Share2,
  database: Database,
  "bar-chart": BarChart3,
  "file-text": FileText,
  globe: Globe,
  layers: Layers,
  zap: Zap,
  send: Send,
  webhook: Webhook,
  "file-spreadsheet": FileSpreadsheet,
  filter: Filter,
  brain: Brain,
  mail: Mail,
  "message-square": MessageSquare,
  calendar: Calendar,
  "alert-circle": AlertCircle,
  activity: Activity,
  type: Type,
  bell: Bell,
};

function NodeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Zap;
  return <Icon className={className} />;
}

function ConnectionLine() {
  return (
    <div className="flex items-center shrink-0 w-10 self-center">
      <svg viewBox="0 0 40 20" className="w-full h-5" aria-hidden="true">
        <circle cx="4" cy="10" r="3" className="fill-accent/50" />
        <line
          x1="7"
          y1="10"
          x2="33"
          y2="10"
          className="stroke-accent/30"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <circle cx="36" cy="10" r="3" className="fill-accent/50" />
      </svg>
    </div>
  );
}

export function WorkflowDiagram({ workflows }: { workflows: Workflow[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const activeWorkflow = workflows[activeIndex];

  // Find the hovered node data for the info bar
  const hoveredNodeData = (() => {
    if (!hoveredNode || hoveredNode.startsWith("m-")) return null;
    const [stageIdxStr, ...labelParts] = hoveredNode.split("-");
    const stageIdx = parseInt(stageIdxStr, 10);
    const label = labelParts.join("-");
    const stage = activeWorkflow.stages[stageIdx];
    const node = stage?.nodes.find((n) => n.label === label);
    return node ? { stage: stage.label, ...node } : null;
  })();

  return (
    <div>
      {workflows.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {workflows.map((workflow, index) => (
            <button
              key={workflow.title}
              onClick={() => {
                setActiveIndex(index);
                setHoveredNode(null);
              }}
              className={`chip cursor-pointer ${
                index === activeIndex
                  ? "border-accent bg-accent-soft text-accent"
                  : ""
              }`}
            >
              {workflow.title}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm leading-7 text-muted mb-8">
        {activeWorkflow.description}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Desktop: horizontal canvas */}
          <div className="hidden lg:block workflow-canvas overflow-x-auto scrollbar-hidden">
            <div className="flex items-stretch min-w-max p-5">
              {activeWorkflow.stages.map((stage, stageIdx) => (
                <div key={stage.label} className="flex items-stretch">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: stageIdx * 0.08,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="workflow-stage-group"
                  >
                    <p className="section-kicker mb-3">{stage.label}</p>
                    <div className="space-y-2">
                      {stage.nodes.map((node) => {
                        const nodeKey = `${stageIdx}-${node.label}`;
                        const isHovered = hoveredNode === nodeKey;
                        return (
                          <div
                            key={node.label}
                            onMouseEnter={() => setHoveredNode(nodeKey)}
                            onMouseLeave={() => setHoveredNode(null)}
                          >
                            <div
                              className={`workflow-node ${
                                isHovered ? "workflow-node-active" : ""
                              }`}
                            >
                              <NodeIcon
                                name={node.icon}
                                className={`h-4 w-4 shrink-0 transition-colors ${
                                  isHovered ? "text-accent" : "text-muted"
                                }`}
                              />
                              <span className="text-xs font-medium text-foreground leading-tight">
                                {node.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {stageIdx < activeWorkflow.stages.length - 1 && (
                    <ConnectionLine />
                  )}
                </div>
              ))}
            </div>

            {/* Info bar at bottom of canvas */}
            <div className="border-t border-line px-5 py-3 min-h-[3rem] flex items-center">
              <AnimatePresence mode="wait">
                {hoveredNodeData ? (
                  <motion.div
                    key={hoveredNode}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-3"
                  >
                    <NodeIcon
                      name={hoveredNodeData.icon}
                      className="h-4 w-4 shrink-0 text-accent"
                    />
                    <span className="text-xs font-semibold text-foreground">
                      {hoveredNodeData.label}
                    </span>
                    <span className="text-xs text-muted">—</span>
                    <span className="text-xs leading-5 text-muted">
                      {hoveredNodeData.description}
                    </span>
                  </motion.div>
                ) : (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs text-muted/60"
                  >
                    Hover a node to see details
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile / tablet: vertical flow */}
          <div className="lg:hidden workflow-canvas p-4">
            <div className="space-y-2">
              {activeWorkflow.stages.map((stage, stageIdx) => (
                <div key={stage.label}>
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: stageIdx * 0.06,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="workflow-stage-group"
                  >
                    <p className="section-kicker mb-3">{stage.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.nodes.map((node) => {
                        const nodeKey = `m-${stageIdx}-${node.label}`;
                        const isActive = hoveredNode === nodeKey;
                        return (
                          <button
                            key={node.label}
                            type="button"
                            onClick={() =>
                              setHoveredNode(isActive ? null : nodeKey)
                            }
                            className={`workflow-node ${
                              isActive ? "workflow-node-active" : ""
                            } cursor-pointer`}
                          >
                            <NodeIcon
                              name={node.icon}
                              className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                                isActive ? "text-accent" : "text-muted"
                              }`}
                            />
                            <span className="text-xs font-medium text-foreground">
                              {node.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <AnimatePresence>
                      {stage.nodes.map((node) => {
                        const nodeKey = `m-${stageIdx}-${node.label}`;
                        if (hoveredNode !== nodeKey) return null;
                        return (
                          <motion.p
                            key={nodeKey}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs leading-5 text-muted mt-3 overflow-hidden"
                          >
                            {node.description}
                          </motion.p>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>

                  {stageIdx < activeWorkflow.stages.length - 1 && (
                    <div className="flex justify-center py-1.5">
                      <svg
                        viewBox="0 0 20 24"
                        className="w-5 h-6"
                        aria-hidden="true"
                      >
                        <circle cx="10" cy="3" r="3" className="fill-accent/50" />
                        <line
                          x1="10"
                          y1="6"
                          x2="10"
                          y2="18"
                          className="stroke-accent/30"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                        <circle cx="10" cy="21" r="3" className="fill-accent/50" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
