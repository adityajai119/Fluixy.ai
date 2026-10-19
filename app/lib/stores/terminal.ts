import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { atom, type WritableAtom } from 'nanostores';
import type { ITerminal } from '~/types/terminal';
import { newfluixyShellProcess, newShellProcess } from '~/utils/shell';
import { coloredText } from '~/utils/terminal';

export class TerminalStore {
  #webcontainer: Promise<WebContainer>;
  #terminals: Array<{ terminal: ITerminal; process: WebContainerProcess }> = [];
  #fluixyTerminal = newfluixyShellProcess();
  #pendingfluixyOutput = '';
  #fluixyOutputReady = false;

  showTerminal: WritableAtom<boolean> = import.meta.hot?.data.showTerminal ?? atom(true);

  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.#webcontainer = webcontainerPromise;

    if (import.meta.hot) {
      import.meta.hot.data.showTerminal = this.showTerminal;
    }
  }
  get fluixyTerminal() {
    return this.#fluixyTerminal;
  }

  toggleTerminal(value?: boolean) {
    this.showTerminal.set(value !== undefined ? value : !this.showTerminal.get());
  }
  writeTofluixyTerminal(data: string) {
    const terminal = this.#fluixyTerminal.terminal;

    if (terminal && this.#fluixyOutputReady) {
      terminal.write(data);
    } else {
      // Tools can start before the workbench mounts its terminal.
      this.#pendingfluixyOutput = (this.#pendingfluixyOutput + data).slice(-64_000);
    }
  }

  async attachfluixyTerminal(terminal: ITerminal) {
    this.#fluixyOutputReady = false;

    try {
      const wc = await this.#webcontainer;
      await this.#fluixyTerminal.init(wc, terminal);

      if (this.#pendingfluixyOutput) {
        terminal.write(this.#pendingfluixyOutput);
        this.#pendingfluixyOutput = '';
      }

      this.#fluixyOutputReady = true;
    } catch (error: any) {
      terminal.write(coloredText.red('Failed to spawn fluixy shell\n\n') + error.message);
      return;
    }
  }

  async attachTerminal(terminal: ITerminal) {
    try {
      const shellProcess = await newShellProcess(await this.#webcontainer, terminal);
      this.#terminals.push({ terminal, process: shellProcess });
    } catch (error: any) {
      terminal.write(coloredText.red('Failed to spawn shell\n\n') + error.message);
      return;
    }
  }

  onTerminalResize(cols: number, rows: number) {
    for (const { process } of this.#terminals) {
      process.resize({ cols, rows });
    }
  }

  async detachTerminal(terminal: ITerminal) {
    const terminalIndex = this.#terminals.findIndex((t) => t.terminal === terminal);

    if (terminalIndex !== -1) {
      const { process } = this.#terminals[terminalIndex];

      try {
        process.kill();
      } catch (error) {
        console.warn('Failed to kill terminal process:', error);
      }
      this.#terminals.splice(terminalIndex, 1);
    }
  }
}
