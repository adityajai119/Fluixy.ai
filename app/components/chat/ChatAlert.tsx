import { AnimatePresence, motion } from 'framer-motion';
import type { ActionAlert } from '~/types/actions';
import { classNames } from '~/utils/classNames';

interface Props {
  alert: ActionAlert;
  clearAlert: () => void;
  postMessage: (message: string) => void;
}

export default function ChatAlert({ alert, clearAlert, postMessage }: Props) {
  const { description, content, source } = alert;

  const isPreview = source === 'preview';
  const title = isPreview ? 'Preview Error' : 'Terminal Error';
  const message = isPreview
    ? 'We encountered an error while running the preview. Would you like fluixy to analyze and help resolve this issue?'
    : 'We encountered an error while running terminal commands. Would you like fluixy to analyze and help resolve this issue?';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`rounded-lg border border-fluixy-elements-borderColor bg-fluixy-elements-background-depth-2 p-4 mb-2`}
      >
        <div className="flex items-start">
          {/* Icon */}
          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`i-ph:warning-duotone text-xl text-fluixy-elements-button-danger-text`}></div>
          </motion.div>
          {/* Content */}
          <div className="ml-3 flex-1">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`text-sm font-medium text-fluixy-elements-textPrimary`}
            >
              {title}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`mt-2 text-sm text-fluixy-elements-textSecondary`}
            >
              <p>{message}</p>
              {description && (
                <div className="text-xs text-fluixy-elements-textSecondary p-2 bg-fluixy-elements-background-depth-3 rounded mt-4 mb-4">
                  Error: {description}
                </div>
              )}
            </motion.div>

            {/* Smart Recovery Actions */}
            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() =>
                  postMessage(
                    `*Fix this ${isPreview ? 'preview' : 'terminal'} error* \n\`\`\`${isPreview ? 'js' : 'sh'}\n${content}\n\`\`\`\n`,
                  )
                }
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-fluixy-elements-button-primary-background hover:bg-fluixy-elements-button-primary-backgroundHover text-fluixy-elements-button-primary-text flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <div className="i-ph:wrench-duotone text-sm"></div>
                Auto-Fix Error
              </button>

              <button
                onClick={() =>
                  postMessage(`This error is persistent. Let's simplify the approach and try an easier alternative.`)
                }
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-fluixy-elements-background-depth-3 hover:bg-fluixy-elements-background-depth-4 text-fluixy-elements-textPrimary flex items-center gap-1.5 transition-colors border border-fluixy-elements-borderColor/50"
              >
                <div className="i-ph:magic-wand-duotone text-sm"></div>
                Simplify Approach
              </button>

              <button
                onClick={() =>
                  postMessage(`Let's break down the problem step-by-step and fix this ${isPreview ? 'preview' : 'terminal'} error systematically.`)
                }
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-fluixy-elements-background-depth-3 hover:bg-fluixy-elements-background-depth-4 text-fluixy-elements-textPrimary flex items-center gap-1.5 transition-colors border border-fluixy-elements-borderColor/50"
              >
                <div className="i-ph:steps-duotone text-sm"></div>
                Step-by-Step Fix
              </button>

              <button
                onClick={clearAlert}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary hover:bg-fluixy-elements-background-depth-3 transition-colors ml-auto"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
