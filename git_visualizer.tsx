import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Files, Box, Database, ArrowRight, RotateCcw, 
  Trash2, CheckCircle2, Info, History, Tag, GitBranch, 
  FolderPlus, ArrowRightLeft, ChevronRight, AlertCircle, 
  User, Settings, FileCode, Clock, Hash, Cloud, Search,
  Archive, Layers, Wrench,  Download, Upload, Scissors,
  BookOpen, Play, Split, GitMerge, GitCommit, Eye
} from 'lucide-react';

const App = () => {
  const [activeCommand, setActiveCommand] = useState('config');
  const [expandedCategory, setExpandedCategory] = useState('Start & Setup');
  const terminalEndRef = useRef(null);
  
  // -- GLOBAL SIMULATION STATE --
  const [user, setUser] = useState({ name: '', email: '' });
  const [isRepoInit, setIsRepoInit] = useState(false);
  const [branches, setBranches] = useState(['main']);
  const [currentBranch, setCurrentBranch] = useState('main');
  
  // State for flow visualization tracking
  const [files, setFiles] = useState({
    working: [{ id: 'f1', name: 'index.html' }, { id: 'f2', name: 'styles.css' }, { id: 'f3', name: 'app.js' }],
    staging: [],
  });
  
  const [repo, setRepo] = useState([
    { id: 'a1b2c', msg: 'Initial commit', branch: 'main' }
  ]);
  
  // Log state
  const [log, setLog] = useState([
    { type: 'sys', text: 'Git Interactive Shell v3.0 initialized...' },
    { type: 'sys', text: 'Animation Engine: Online. Select a command.' }
  ]);
  
  // Explanation state
  const [explanation, setExplanation] = useState('');

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  // Helper to run commands with a simulated typing delay
  const executeCommand = (cmdStr, outputStr, explainStr) => {
    // 1. Instantly show the command being "typed"
    setLog(prev => [...prev, { type: 'cmd', text: cmdStr }].slice(-30));
    if (explainStr) setExplanation(explainStr);

    // 2. Delay the output slightly for realism
    if (outputStr) {
      setTimeout(() => {
        setLog(prev => [...prev, { type: 'out', text: outputStr }].slice(-30));
      }, 400);
    }
  };

  // -- COMMANDS DATABASE --
  const categories = {
    "Start & Setup": ["config", "init", "clone", "remote"],
    "Daily Workflow": ["status", "add", "commit", "restore", "rm", "mv", "clean"],
    "Inspection": ["diff", "log", "show", "shortlog", "grep", "blame"],
    "Branching & Merging": ["branch", "switch", "checkout", "merge", "rebase", "cherry-pick"],
    "Syncing": ["fetch", "pull", "push"],
    "Undo & Fixes": ["reset", "revert", "stash", "amend"],
    "Advanced": ["archive", "bundle", "gc", "reflog", "worktree", "submodule", "bisect", "tag"]
  };

  const commands = useMemo(() => ({
    // --- START & SETUP ---
    config: {
      title: 'Configure Git',
      cli: 'git config --global user.name "Name"',
      desc: 'Sets your global identity. Git embeds this information into every commit you make so others know who wrote the code.',
      mode: 'identity',
      actions: [{ label: 'Set Identity', run: () => { 
        setUser({name: 'Dev', email: 'dev@site.com'}); 
        executeCommand('git config --global user.name "Dev"', '', 'Identity configured! Now your "Digital Signature" is ready.'); 
      } }]
    },
    init: {
      title: 'Initialize Repository',
      cli: 'git init',
      desc: 'Transforms the current directory into a Git Repository. It creates a hidden .git folder that tracks every version of your files.',
      mode: 'creation',
      actions: [{ label: 'Run Init', run: () => { 
        setIsRepoInit(true); 
        executeCommand('git init', 'Initialized empty Git repository in /project/.git/', 'Success! The .git folder is created. This directory is the "brain" of your project.'); 
      } }]
    },
    clone: {
      title: 'Clone Repository',
      cli: 'git clone <url>',
      desc: 'Downloads a complete copy of a repository from a server (like GitHub), including the entire history of every file.',
      mode: 'remote',
      actions: [{ label: 'Clone Repo', run: () => executeCommand('git clone https://github.com/demo/site.git', 'Cloning into "site"...\nremote: Enumerating objects: 100, done.\nremote: Total 100 (delta 20), reused 100\nUnpacking objects: 100% (100/100), done.', 'Repository downloaded. You now have a full local copy of the project history linked to the remote.') }]
    },
    remote: {
      title: 'Remote Connections',
      cli: 'git remote add origin <url>',
      desc: 'Manages the connection to a remote server. "Origin" is the standard nickname for the primary server your repo talks to.',
      mode: 'remote',
      actions: [{ label: 'Add Origin', run: () => executeCommand('git remote add origin https://repo.com/site.git', '', 'Link established. Your local repo now knows where to push code when you say "origin".') }]
    },

    // --- DAILY WORKFLOW ---
    status: {
      title: 'Check Status',
      cli: 'git status',
      desc: 'The dashboard of Git. It answers: "What changed?" and "What is staged?". You should run this command constantly.',
      mode: 'flow',
      actions: [{ label: 'Check Status', run: () => executeCommand('git status', `On branch ${currentBranch}\n\nUntracked files:\n  ${files.working.map(f=>f.name).join('\n  ')}\n\n${files.staging.length} files staged for commit.`, 'Status check complete. Red items are untracked/modified. Blue items are staged and ready to commit.') }]
    },
    add: {
      title: 'Add to Staging',
      cli: 'git add <file>',
      desc: 'Moves changes from the Working Directory to the Staging Area. Think of this as "packing a box" before you ship it (commit).',
      mode: 'flow',
      actions: [{ label: 'Stage All', run: () => { 
        if (files.working.length === 0) return executeCommand('git add .', 'Nothing to stage', '');
        setFiles(p => ({working: [], staging: [...p.staging, ...p.working]})); 
        executeCommand('git add .', '', 'Files animated into the Staging Area. They are now tracked and ready to be committed.'); 
      } }]
    },
    commit: {
      title: 'Commit Snapshot',
      cli: 'git commit -m "msg"',
      desc: 'Seals the Staging Area into a permanent snapshot. This saves a version of your project in history that you can always return to.',
      mode: 'flow',
      actions: [{ label: 'Commit', run: () => { 
        if(files.staging.length===0) return executeCommand('git commit', 'nothing to commit, working tree clean', 'Error: Staging area is empty. Use "git add" first.');
        const hash = Math.random().toString(16).substring(2, 7);
        setRepo(p => [{ id: hash, msg: 'Update site', branch: currentBranch }, ...p]);
        setFiles(p => ({...p, staging: []}));
        executeCommand('git commit -m "Update site"', `[${currentBranch} ${hash}] Update site\n ${files.staging.length} files changed`, 'Snapshot saved! A new commit object has been created in the .git database.');
      } }]
    },
    restore: {
      title: 'Restore Files',
      cli: 'git restore <file>',
      desc: 'Dangerous Command: Discards changes in the working directory. It overwrites your current work with the last committed version.',
      mode: 'flow',
      actions: [{ label: 'Restore All', run: () => {
        setFiles(p => ({...p, working: []}));
        executeCommand('git restore .', '', 'Working directory reset. All uncommitted changes have been permanently erased.'); 
      }}]
    },
    rm: {
      title: 'Remove Files',
      cli: 'git rm <file>',
      desc: 'Deletes a file from both the working directory AND the staging area, preparing the deletion to be committed.',
      mode: 'flow',
      actions: [{ label: 'Remove app.js', run: () => {
        setFiles(p => ({
          working: p.working.filter(f => f.name !== 'app.js'),
          staging: p.staging.filter(f => f.name !== 'app.js')
        }));
        executeCommand('git rm app.js', 'rm "app.js"', 'File deleted and staged for removal.'); 
      }}]
    },
    mv: {
      title: 'Move / Rename',
      cli: 'git mv <old> <new>',
      desc: 'Renames a file and immediately stages the change. It is a shortcut for: mv file, git rm old, git add new.',
      mode: 'flow',
      actions: [{ label: 'Rename style', run: () => {
        setFiles(p => {
          const updatedWorking = p.working.filter(f => f.name !== 'styles.css');
          return { working: updatedWorking, staging: [...p.staging, {id: 'r1', name: 'main.css'}] };
        });
        executeCommand('git mv styles.css main.css', '', 'File renamed and automatically staged.'); 
      }}]
    },
    clean: {
      title: 'Clean Untracked',
      cli: 'git clean -fd',
      desc: 'Removes untracked files (new files you have not added yet) from the working tree. -f means force, -d means directories.',
      mode: 'flow',
      actions: [{ label: 'Clean', run: () => {
         setFiles(p => ({...p, working: []}));
         executeCommand('git clean -fd', 'Removing temp/', 'Garbage collection complete. All untracked files have been deleted.'); 
      }}]
    },

    // --- INSPECTION ---
    diff: {
      title: 'View Changes (Diff)',
      cli: 'git diff',
      desc: 'Shows the line-by-line differences between your working directory and the staging area (or last commit).',
      mode: 'diff',
      actions: [{ label: 'Show Diff', run: () => executeCommand('git diff', 'diff --git a/index.html b/index.html\nindex 832..912 100644\n--- a/index.html\n+++ b/index.html\n@@ -10,2 +10,2 @@\n- <h1>Old Title</h1>\n+ <h1>New Title</h1>', 'You are seeing the "Diff". Lines starting with (-) were removed, lines with (+) were added.') }]
    },
    log: {
      title: 'Commit History',
      cli: 'git log --oneline',
      desc: 'Displays the chronological list of commits (snapshots). Press "q" to exit the log view in a real terminal.',
      mode: 'graph',
      actions: [{ label: 'Show Log', run: () => executeCommand('git log --oneline', repo.map(r => `${r.id} (${r.branch}) ${r.msg}`).join('\n'), 'This is your project timeline. The HEAD pointer shows where you are right now.') }]
    },
    show: {
      title: 'Show Object',
      cli: 'git show <commit>',
      desc: 'Inspects a specific commit or object details. It shows the log message AND the diff for that commit.',
      mode: 'diff',
      actions: [{ label: 'Show HEAD', run: () => executeCommand('git show HEAD', 'commit a1b2c...\nAuthor: Dev\nDate: Mon Feb 14\n\n    Update site\n\ndiff --git a/app.js b/app.js...', 'Detailed view of the latest commit displayed.') }]
    },
    grep: {
      title: 'Search Code',
      cli: 'git grep "text"',
      desc: 'Searches for a text pattern in all TRACKED files. Much faster than standard search because it uses the git index.',
      mode: 'code',
      actions: [{ label: 'Search "TODO"', run: () => executeCommand('git grep "TODO"', 'app.js:45: // TODO: Fix login bug\nstyles.css:12: /* TODO: Refactor colors */', 'Search complete. Git found these occurrences in the version controlled files.') }]
    },
    blame: {
      title: 'Git Blame',
      cli: 'git blame <file>',
      desc: 'Annotates each line of a file with the name of the person who last modified it and the commit hash.',
      mode: 'code',
      actions: [{ label: 'Blame app.js', run: () => executeCommand('git blame app.js', 'a1b2c (Alice 2024-02-01) const app = init();\nd4e5f (Bob   2024-01-20) console.log("Ready");', 'Blame view loaded. You can now see who wrote every specific line of code.') }]
    },

    // --- BRANCHING ---
    branch: {
      title: 'Manage Branches',
      cli: 'git branch <name>',
      desc: 'Creates a new pointer (branch) to the current commit. Branches allow you to work on features in isolation.',
      mode: 'graph',
      actions: [{ label: 'Create "feature"', run: () => { 
        if (!branches.includes('feature')) setBranches(p => [...p, 'feature']); 
        executeCommand('git branch feature', '', 'Branch "feature" created. Note: You are still on "main". Use switch/checkout to move there.'); 
      }}]
    },
    switch: {
      title: 'Switch Branch',
      cli: 'git switch <name>',
      desc: 'Updates your Working Directory to match the files in the target branch.',
      mode: 'graph',
      actions: [{ label: 'Switch "feature"', run: () => { 
        if (!branches.includes('feature')) return executeCommand('git switch feature', 'fatal: invalid reference', 'Create the branch first.');
        setCurrentBranch('feature'); 
        executeCommand('git switch feature', 'Switched to branch "feature"', 'Your workspace files have been swapped out to match the "feature" branch state.'); 
      }}]
    },
    checkout: {
      title: 'Checkout',
      cli: 'git checkout <ref>',
      desc: 'The classic command to switch branches. Also used to restore files (checkout -- file).',
      mode: 'graph',
      actions: [{ label: 'Checkout main', run: () => { 
        setCurrentBranch('main'); 
        executeCommand('git checkout main', 'Switched to branch "main"', 'You are back on the main timeline.'); 
      }}]
    },
    merge: {
      title: 'Merge Branch',
      cli: 'git merge <branch>',
      desc: 'Combines the history of a target branch into your current branch. This often creates a "Merge Commit".',
      mode: 'graph',
      actions: [{ label: 'Merge feature', run: () => { 
        setCurrentBranch('main');
        setRepo(p => [{ id: 'm1r9', msg: 'Merge branch feature', branch: 'main' }, ...p]);
        executeCommand('git merge feature', 'Updating a1b2..c3d4\nFast-forward\n 2 files changed', 'Success. The changes from "feature" have been integrated into your current branch.'); 
      }}]
    },
    rebase: {
      title: 'Rebase',
      cli: 'git rebase main',
      desc: 'Rewrites history. It lifts your branch and places it on the tip of another branch to create a linear history.',
      mode: 'graph',
      actions: [{ label: 'Rebase', run: () => executeCommand('git rebase main', 'Successfully rebased and updated refs/heads/feature.', 'History rewritten! Your branch now looks like it branched off from the latest main commit.') }]
    },
    "cherry-pick": {
      title: 'Cherry Pick',
      cli: 'git cherry-pick <hash>',
      desc: 'Applies the changes from a specific commit (from any branch) onto your current branch.',
      mode: 'graph',
      actions: [{ label: 'Pick Commit', run: () => {
        setRepo(p => [{ id: 'c9p8', msg: 'Cherry picked fix', branch: currentBranch }, ...p]);
        executeCommand('git cherry-pick a1b2c', '[main c9p8] Cherry picked fix', 'Commit copied. You took just one specific change from another branch without merging the whole thing.'); 
      }}]
    },

    // --- SYNCING ---
    fetch: {
      title: 'Fetch Remote',
      cli: 'git fetch origin',
      desc: 'Downloads new data (commits, files, refs) from the remote repository but DOES NOT merge them into your work.',
      mode: 'remote',
      actions: [{ label: 'Fetch', run: () => executeCommand('git fetch origin', 'Unpacking objects: 100% (5/5)...\nFrom github.com:site\n * [new branch]      devel      -> origin/devel', 'Data downloaded. Your local "origin/main" reference is updated, but your working files are untouched.') }]
    },
    pull: {
      title: 'Pull',
      cli: 'git pull origin main',
      desc: 'Updates your current branch with changes from the remote. Equivalent to: git fetch + git merge.',
      mode: 'remote',
      actions: [{ label: 'Pull', run: () => executeCommand('git pull origin main', 'Updating a1b2..z9y8\nFast-forward\n app.js | 2 ++\n 1 file changed', 'Sync complete. Your code is now up to date with the server.') }]
    },
    push: {
      title: 'Push',
      cli: 'git push origin main',
      desc: 'Uploads your local commits to the remote repository.',
      mode: 'remote',
      actions: [{ label: 'Push', run: () => executeCommand('git push origin main', 'To https://github.com/repo\n   a1b2..z9y8  main -> main', 'Upload complete. Your changes are now live on the server.') }]
    },

    // --- UNDO ---
    reset: { title: 'Reset', cli: 'git reset --soft HEAD~1', desc: 'Moves the HEAD pointer backward. --soft keeps changes in staging; --hard deletes them.', mode: 'flow', actions: [{ label: 'Soft Reset', run: () => {
      if(repo.length <= 1) return executeCommand('git reset', 'Error', 'Need more commits');
      setRepo(p => p.slice(1));
      setFiles(p => ({working: p.working, staging: [...p.staging, {id: 'rst', name: 'recovered.js'}]}));
      executeCommand('git reset --soft HEAD~1', '', 'Time travel complete. You stepped back 1 commit, but your work is safely kept in the Staging Area.'); 
    }}] },
    revert: { title: 'Revert', cli: 'git revert <commit>', desc: 'Creates a *new* commit that is the exact opposite of an old commit. Safe for shared branches.', mode: 'graph', actions: [{ label: 'Revert', run: () => {
      setRepo(p => [{ id: 'rev1', msg: `Revert "${p[0].msg}"`, branch: currentBranch }, ...p]);
      executeCommand('git revert HEAD', '[main rev1] Revert previous', 'Undo recorded. A new commit was added that deletes the changes made in the target commit.'); 
    }}] },
    stash: { title: 'Stash', cli: 'git stash', desc: 'Saves your dirty working directory to a temporary stack so you can switch branches cleanly.', mode: 'flow', actions: [{ label: 'Stash', run: () => {
      setFiles({working: [], staging: []});
      executeCommand('git stash', 'Saved working directory and index state WIP on main', 'Workspace cleared. Your changes are saved in the stash stack. Use "git stash pop" to get them back.'); 
    }}] },
    amend: { title: 'Amend', cli: 'git commit --amend', desc: 'Combines staged changes with the *previous* commit. Useful for fixing typos in commit messages.', mode: 'flow', actions: [{ label: 'Amend', run: () => executeCommand('git commit --amend -m "Fixed typo"', '[main b2c3d] Fixed typo', 'History rewritten. The previous commit was replaced by this new, corrected version.') }] },

    // --- ADVANCED ---
    archive: { title: 'Archive', cli: 'git archive', desc: 'Export the project files into a zip/tar file.', mode: 'info', actions: [{ label: 'Zip', run: () => executeCommand('git archive --format=zip HEAD > site.zip', '', 'Archive created.') }] },
    bisect: { title: 'Bisect', cli: 'git bisect start', desc: 'Binary search debugging to find which commit introduced a bug.', mode: 'info', actions: [{ label: 'Start Bisect', run: () => executeCommand('git bisect start', 'Waiting for bad/good range...', 'Debug mode started.') }] },
    tag: { title: 'Tag', cli: 'git tag v1.0', desc: 'Mark a commit as a release.', mode: 'graph', actions: [{ label: 'Tag v1.0', run: () => executeCommand('git tag v1.0', '', 'Tag created.') }] },
    worktree: { title: 'Worktree', cli: 'git worktree', desc: 'Manage multiple working trees.', mode: 'info', actions: [{ label: 'List', run: () => executeCommand('git worktree list', '/path/ (main)', 'Showing worktrees.') }] },
    reflog: { title: 'Reflog', cli: 'git reflog', desc: 'The safety net. Shows every movement of HEAD.', mode: 'graph', actions: [{ label: 'Show Reflog', run: () => executeCommand('git reflog', 'a1b2c HEAD@{0}: commit: msg', 'Reflog displayed.') }] },
    gc: { title: 'GC', cli: 'git gc', desc: 'Garbage Collection. Optimizes the database.', mode: 'info', actions: [{ label: 'Run GC', run: () => executeCommand('git gc', 'Enumerating objects...', 'Repo optimized.') }] },
    submodule: { title: 'Submodule', cli: 'git submodule', desc: 'Manage nested repositories.', mode: 'info', actions: [{ label: 'Status', run: () => executeCommand('git submodule status', '', 'No submodules found.') }] },
    bundle: { title: 'Bundle', cli: 'git bundle', desc: 'Package repo into a single file.', mode: 'info', actions: [{ label: 'Create', run: () => executeCommand('git bundle create repo.bundle HEAD', '', 'Bundle created.') }] },
    "shortlog": { title: 'Shortlog', cli: 'git shortlog', desc: 'Summarize git log output.', mode: 'info', actions: [{ label: 'Summary', run: () => executeCommand('git shortlog -s -n', '  5 Dev\n  2 Alice', 'Summary generated.') }] },

  }), [files, currentBranch, user, branches, repo]);

  const currentCmd = commands[activeCommand] || commands['config'];

  useEffect(() => {
    setExplanation(currentCmd.desc);
  }, [activeCommand]);

  // --- VISUALIZATION MODES (ANIMATED) ---

  const IdentityVisual = () => (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center h-full">
       <div className="relative group">
         <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
         <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-80 relative flex flex-col items-center shadow-2xl">
            <motion.div animate={{ rotate: user.name ? 360 : 0 }} transition={{ duration: 1 }} className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <User size={40} className="text-white" />
            </motion.div>
            <div className="text-2xl font-bold text-white mb-1">{user.name || 'Anonymous'}</div>
            <div className="text-sm font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              {user.email || 'user.email not set'}
            </div>
         </div>
       </div>
    </motion.div>
  );

  const FlowVisual = () => (
    <div className="grid grid-cols-3 gap-4 h-full items-center px-4 relative">
      
      {/* Working Directory */}
      <div className="flex flex-col items-center p-4 rounded-xl border-2 border-slate-800 bg-slate-900/50 h-64 z-10">
        <FileCode size={32} className="text-red-400 mb-3" />
        <div className="text-xs uppercase font-bold text-red-400 mb-2 tracking-wider">Working</div>
        <div className="w-full space-y-2 relative h-full">
           <AnimatePresence>
             {files.working.map((f, i) => (
               <motion.div 
                 key={f.id}
                 layoutId={f.id} // Magic property for smooth multi-container transitions
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, scale: 0.5 }}
                 className="text-[10px] bg-red-900/30 text-red-200 px-2 py-1.5 rounded border border-red-500/20 flex items-center gap-2 shadow-sm"
               >
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {f.name}
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      </div>

      {/* Staging Area */}
      <div className="flex flex-col items-center relative h-full justify-center z-10">
        <div className="w-full flex flex-col items-center p-4 rounded-xl border-2 border-slate-800 bg-slate-900/50 h-64">
          <Box size={32} className="text-blue-400 mb-3" />
          <div className="text-xs uppercase font-bold text-blue-400 mb-2 tracking-wider">Staging</div>
          <div className="w-full space-y-2 relative h-full">
            <AnimatePresence>
              {files.staging.map(f => (
                <motion.div 
                  key={f.id}
                  layoutId={f.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0 }}
                  className="text-[10px] bg-blue-900/30 text-blue-200 px-2 py-1.5 rounded border border-blue-500/20 flex items-center gap-2 shadow-sm"
                >
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {f.name}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Repository */}
      <div className="flex flex-col items-center p-4 rounded-xl border-2 border-slate-800 bg-slate-900/50 h-64 z-10">
        <Database size={32} className="text-emerald-400 mb-3" />
        <div className="text-xs uppercase font-bold text-emerald-400 mb-2 tracking-wider">Repository</div>
        <div className="w-full space-y-2 mt-2">
           <AnimatePresence>
             {repo.slice(0,3).map((r, i) => (
               <motion.div 
                 key={r.id}
                 initial={{ opacity: 0, y: -20, scale: 0.9 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 className="text-[10px] bg-emerald-900/30 text-emerald-200 px-2 py-2 rounded border border-emerald-500/20 shadow-sm"
               >
                 <div className="flex justify-between text-emerald-500 font-mono font-bold mb-1">
                   <span>{r.id}</span>
                   {i === 0 && <span className="bg-emerald-500/20 px-1 rounded">HEAD</span>}
                 </div>
                 <div className="truncate">{r.msg}</div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      </div>
      
      {/* Animated Background Flow Lines */}
      <div className="absolute top-1/2 left-[20%] right-[20%] h-1 bg-slate-800 -z-0 rounded-full" />
      <motion.div 
        className="absolute top-1/2 left-[20%] right-[20%] h-1 bg-gradient-to-r from-red-500 via-blue-500 to-emerald-500 -z-0 rounded-full origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      />
    </div>
  );

  const GraphVisual = () => (
    <div className="h-full flex flex-col px-8 py-4 bg-slate-900/50 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-2 z-10 bg-slate-900/80 backdrop-blur w-max px-2 rounded">
        <GitBranch size={16} className="text-orange-400" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Network Graph</span>
      </div>
      
      <div className="relative flex-1 pt-4">
        {/* Main Branch Line */}
        <motion.div initial={{ height: 0 }} animate={{ height: '100%' }} className="absolute left-8 top-0 w-1 bg-blue-900 rounded-full" />
        
        {/* Feature Branch Line */}
        {branches.includes('feature') && (
          <motion.path 
            initial={{ pathLength: 0 }} 
            animate={{ pathLength: 1 }} 
            className="absolute top-12 left-8 w-12 h-24 border-l-2 border-b-2 border-orange-500 rounded-bl-3xl pointer-events-none" 
          />
        )}

        <div className="space-y-10 relative z-10 flex flex-col">
          <AnimatePresence>
            {repo.map((commit, idx) => {
              const isFeature = commit.branch === 'feature';
              return (
                <motion.div 
                  key={commit.id}
                  initial={{ opacity: 0, x: -50, scale: 0 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  layout
                  className={`flex items-center gap-4 ${isFeature ? 'ml-[3.25rem]' : 'ml-6'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-4 border-slate-900 shadow-lg ${isFeature ? 'bg-orange-500 ring-2 ring-orange-500/30' : 'bg-blue-500 ring-2 ring-blue-500/30'}`} />
                  <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-3">
                    <span className="text-yellow-400 font-mono text-[10px]">{commit.id}</span>
                    <span className={`text-xs font-bold ${isFeature ? 'text-orange-300' : 'text-blue-300'}`}>{commit.msg}</span>
                    {idx === 0 && <span className="text-[9px] bg-slate-700 px-1 rounded uppercase">HEAD</span>}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const RemoteVisual = () => (
    <div className="flex items-center justify-center h-full gap-8">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center">
        <div className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center border-2 border-slate-600 shadow-xl relative overflow-hidden group">
          <Database size={32} className="text-slate-400 group-hover:scale-110 transition-transform" />
        </div>
        <span className="mt-3 text-[10px] font-bold text-slate-500 tracking-widest bg-slate-800 px-2 py-1 rounded">LOCAL REPO</span>
      </motion.div>
      
      <div className="flex flex-col gap-4 text-slate-600 w-32 items-center relative">
        <div className="w-full h-px bg-slate-800 absolute top-1/2 -translate-y-1/2" />
        
        {/* Animated Packets */}
        <motion.div 
          animate={{ x: [0, 100], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-3 h-3 bg-blue-500 rounded-full absolute top-[30%] shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
        />
        <motion.div 
          animate={{ x: [100, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
          className="w-3 h-3 bg-emerald-500 rounded-full absolute bottom-[30%] shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
        />
      </div>

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center">
        <div className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center border-2 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.3)] relative overflow-hidden group">
          <Cloud size={32} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
        </div>
        <span className="mt-3 text-[10px] font-bold text-blue-500 tracking-widest bg-blue-900/30 px-2 py-1 rounded border border-blue-500/20">ORIGIN</span>
      </motion.div>
    </div>
  );

  const DiffVisual = () => (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
         <div className="flex items-center gap-2 text-slate-400">
           <Split size={14} /> <span className="text-xs font-mono">index.html</span>
         </div>
       </div>
       <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1">
         <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex bg-red-900/20 border-l-4 border-red-500">
           <div className="w-8 text-right text-slate-600 pr-2 select-none bg-red-900/30">12</div>
           <div className="text-red-300 pl-2">- &lt;h1&gt;Welcome to Git&lt;/h1&gt;</div>
         </motion.div>
         <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex bg-emerald-900/20 border-l-4 border-emerald-500">
           <div className="w-8 text-right text-slate-600 pr-2 select-none bg-emerald-900/30">12</div>
           <div className="text-emerald-300 pl-2">+ &lt;h1&gt;Interactive Visualizer&lt;/h1&gt;</div>
         </motion.div>
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex opacity-50">
           <div className="w-8 text-right text-slate-600 pr-2 select-none bg-slate-900">13</div>
           <div className="text-slate-300 pl-2">  &lt;p&gt;Learn by doing.&lt;/p&gt;</div>
         </motion.div>
       </div>
    </div>
  );

  const CodeVisual = () => (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
       <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] text-slate-400 text-xs border-b border-[#3e3e42]">
         <Search size={12} /> Search Results
       </div>
       <div className="p-4 font-mono text-xs space-y-1">
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex bg-[#3c3c3c] border-l-2 border-yellow-500">
            <span className="text-slate-400 w-8 text-right mr-3">46</span>
            <span className="text-[#6a9955]">// <span className="bg-yellow-500/30 text-yellow-200 font-bold px-1">TODO</span>: Fix login bug</span>
         </motion.div>
       </div>
    </div>
  );

  const CreationVisual = () => (
     <div className="flex flex-col items-center justify-center h-full">
        <motion.div 
          animate={{ scale: isRepoInit ? [1, 1.2, 1] : 1 }} 
          transition={{ duration: 0.5 }}
          className="relative"
        >
           <FolderPlus size={80} className={`${isRepoInit ? 'text-blue-500' : 'text-slate-600'}`} />
           <AnimatePresence>
             {isRepoInit && (
               <motion.div 
                 initial={{ scale: 0, opacity: 0 }} 
                 animate={{ scale: 1, opacity: 1 }} 
                 className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-slate-900"
               >
                 <CheckCircle2 size={16} className="text-white" />
               </motion.div>
             )}
           </AnimatePresence>
        </motion.div>
        <div className="mt-6 flex gap-3">
           <div className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-xs text-slate-400 font-mono">index.html</div>
           <AnimatePresence>
             {isRepoInit && (
               <motion.div 
                 initial={{ width: 0, opacity: 0 }} 
                 animate={{ width: 'auto', opacity: 1 }} 
                 className="px-3 py-1 bg-blue-900/30 rounded border border-blue-500/50 text-xs text-blue-300 font-bold font-mono overflow-hidden whitespace-nowrap"
               >
                 .git/
               </motion.div>
             )}
           </AnimatePresence>
        </div>
     </div>
  );

  const InfoVisual = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
       <motion.div 
         animate={{ rotate: 360 }} 
         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
         className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-slate-700"
       >
         <Settings size={32} className="text-slate-400" />
       </motion.div>
       <h3 className="text-lg font-bold text-white mb-2">{currentCmd.title}</h3>
       <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{currentCmd.desc}</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-20 shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90 backdrop-blur">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
            <GitBranch className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-white">Git Visualizer</h1>
            <span className="text-[10px] text-blue-400 font-mono bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-500/20">v3.0.0</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {Object.entries(categories).map(([catName, cmdKeys]) => (
            <div key={catName} className="bg-slate-800/30 rounded-xl border border-slate-800/50 overflow-hidden">
              <button 
                onClick={() => setExpandedCategory(expandedCategory === catName ? null : catName)}
                className="w-full px-4 py-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                {catName}
                <ChevronRight size={14} className={`transition-transform duration-300 ${expandedCategory === catName ? 'rotate-90 text-blue-400' : ''}`} />
              </button>
              
              <AnimatePresence>
                {expandedCategory === catName && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-900/50"
                  >
                    <div className="p-2 space-y-1">
                      {cmdKeys.map(key => {
                        if(!commands[key]) return null;
                        const isActive = activeCommand === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setActiveCommand(key)}
                            className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all flex items-center gap-3 border ${isActive ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-inner' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-blue-400 scale-125 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-600'}`} />
                            {commands[key].title}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        
        {/* HEADER */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-6 flex justify-between items-start z-10 sticky top-0">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">{currentCmd.title}</h2>
              <span className="px-2.5 py-1 rounded-md bg-blue-900/30 border border-blue-500/30 text-[10px] font-mono text-blue-300 uppercase tracking-widest flex items-center gap-1.5">
                <Eye size={12} /> {currentCmd.mode}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">{currentCmd.desc}</p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
             <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest flex items-center gap-2">
                <Play size={10} className="text-emerald-500" /> Execute Simulation
             </div>
             <div className="flex gap-2">
               {currentCmd.actions.map((act, i) => (
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   key={i} 
                   onClick={act.run} 
                   className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-colors border border-emerald-500/50"
                 >
                   <Terminal size={14} /> {act.label}
                 </motion.button>
               ))}
             </div>
          </div>
        </header>

        {/* WORKSPACE */}
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          
          {/* VISUALIZER PANEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-2xl flex flex-col relative overflow-hidden group h-[calc(100vh-140px)]">
            <div className="absolute top-4 left-5 z-20 flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-lg backdrop-blur border border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="w-px h-3 bg-slate-700" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Visual Output</span>
            </div>
            
            <div className="flex-1 bg-slate-950/50 rounded-xl m-1 relative overflow-hidden">
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={currentCmd.mode}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.3 }}
                   className="h-full"
                 >
                   {currentCmd.mode === 'identity' && <IdentityVisual />}
                   {currentCmd.mode === 'creation' && <CreationVisual />}
                   {currentCmd.mode === 'flow' && <FlowVisual />}
                   {currentCmd.mode === 'graph' && <GraphVisual />}
                   {currentCmd.mode === 'remote' && <RemoteVisual />}
                   {currentCmd.mode === 'diff' && <DiffVisual />}
                   {currentCmd.mode === 'code' && <CodeVisual />}
                   {!['identity','creation','flow','graph','remote','diff','code'].includes(currentCmd.mode) && <InfoVisual />}
                 </motion.div>
               </AnimatePresence>
               
               {/* Background Pattern */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />
            </div>
          </div>

          {/* RIGHT COLUMN: CONCEPTS & TERMINAL */}
          <div className="flex flex-col gap-6 min-h-0 h-[calc(100vh-140px)]">
            
            {/* CONCEPT CARD */}
            <motion.div 
              key={explanation}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex-shrink-0 backdrop-blur shadow-xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
               <div className="flex items-center gap-2 mb-3 text-orange-400 font-bold text-xs uppercase tracking-wider">
                  <BookOpen size={16} /> Deep Dive Concept
               </div>
               <p className="text-[15px] text-slate-300 leading-relaxed font-medium">
                 {explanation}
               </p>
            </motion.div>

            {/* TERMINAL EMULATOR */}
            <div className="bg-[#0c0c0c] border border-slate-800 rounded-2xl flex-1 flex flex-col font-mono text-xs shadow-2xl min-h-0 relative overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2 text-slate-400">
                  <Terminal size={14} /> 
                  <span className="font-bold">user@macbook-pro ~ bash</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">
                   <Clock size={10} /> Live Simulation
                </div>
              </div>
              
              <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-1">
                 {log.map((l, i) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     key={i} 
                     className={`leading-relaxed ${l.type === 'cmd' ? 'mt-4 mb-2' : ''}`}
                   >
                     {l.type === 'cmd' && (
                       <div className="flex items-start gap-2 text-white font-bold break-all">
                         <span className="text-emerald-500 mt-0.5">➜</span>
                         <div className="flex flex-wrap gap-x-2">
                           <span className="text-blue-400">~/project</span>
                           <span className="text-slate-500">git:(<span className="text-red-400">{currentBranch}</span>)</span>
                           <span className="text-slate-200">{l.text}</span>
                         </div>
                       </div>
                     )}
                     {l.type === 'out' && (
                       <div className="text-slate-400 pl-4 whitespace-pre-wrap border-l-2 border-slate-800 ml-1 py-0.5 font-medium">{l.text}</div>
                     )}
                     {l.type === 'sys' && (
                       <div className="text-slate-500 italic pl-0 opacity-80 flex items-center gap-2">
                         <span className="w-2 h-px bg-slate-600" /> {l.text}
                       </div>
                     )}
                   </motion.div>
                 ))}
                 <div ref={terminalEndRef} />
                 
                 {/* Typing Cursor Placeholder */}
                 <div className="flex items-start gap-2 text-white font-bold mt-4">
                    <span className="text-emerald-500 mt-0.5">➜</span>
                    <div className="flex flex-wrap gap-x-2 items-center">
                      <span className="text-blue-400">~/project</span>
                      <span className="text-slate-500">git:(<span className="text-red-400">{currentBranch}</span>)</span>
                      <motion.span 
                        animate={{ opacity: [1, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-4 bg-slate-400 block" 
                      />
                    </div>
                 </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default App;