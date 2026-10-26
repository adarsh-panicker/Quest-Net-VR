/**
 * study_academy.js - Full-Featured CCNA & CCNP Study Academy Manager
 *
 * Implements:
 * 1. Sequential topic-by-topic curriculum navigation (CCNA 200-301, CCNP ENCOR 350-401, CCNP ENARSI 300-410).
 * 2. Visual diagrams (SVG), real-world analogies, Cisco IOS CLI configs with clipboard copy, exam tips.
 * 3. 1-Click "Launch 3D Lab Scene" button binding directly to WebXR 3D topologies.
 * 4. Progress tracker with completion checkmarks stored in localStorage.
 * 5. Full-text search and track filtering.
 */

import { CURRICULUM } from './curriculum.js';

const STORAGE_KEY_PROGRESS = 'network_quest_curriculum_completed_v1';
const STORAGE_KEY_LAST_TOPIC = 'network_quest_curriculum_last_topic_v1';

export class StudyAcademyManager {
  constructor(app) {
    this.app = app;
    this.topics = CURRICULUM;
    this.currentTopicIndex = 0;
    this.activeTrackFilter = 'ALL';
    this.searchQuery = '';

    // Load completed topics set from localStorage
    this.completedTopics = new Set();
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) {
        JSON.parse(saved).forEach(id => this.completedTopics.add(id));
      }
      const lastId = localStorage.getItem(STORAGE_KEY_LAST_TOPIC);
      if (lastId) {
        const found = this.topics.findIndex(t => t.id === lastId);
        if (found !== -1) this.currentTopicIndex = found;
      }
    } catch (e) {
      console.warn('Could not read curriculum progress from storage:', e);
    }

    this.initDOM();
  }

  initDOM() {
    this.modal = document.getElementById('study-academy-modal');
    this.sidebarList = document.getElementById('study-topic-list');
    this.trackFilters = document.querySelectorAll('.study-track-pill');
    this.searchInput = document.getElementById('study-search-input');
    this.progressFill = document.getElementById('study-progress-fill');
    this.progressLabel = document.getElementById('study-progress-label');

    // Header Button
    const btnOpen = document.getElementById('btn-study-academy');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => this.openAcademy());
    }

    // Close Button
    const btnClose = document.getElementById('btn-close-study');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.closeAcademy());
    }

    // Track Filter buttons
    this.trackFilters.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.trackFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTrackFilter = btn.dataset.track;
        this.renderSidebar();
      });
    });

    // Search filter
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderSidebar();
      });
    }

    // Navigation buttons
    const btnPrev = document.getElementById('btn-study-prev');
    const btnNext = document.getElementById('btn-study-next');
    const btnCompleteNext = document.getElementById('btn-study-complete-next');
    const btnLaunchLab = document.getElementById('btn-study-launch-lab');

    if (btnPrev) btnPrev.addEventListener('click', () => this.prevTopic());
    if (btnNext) btnNext.addEventListener('click', () => this.nextTopic());
    if (btnCompleteNext) {
      btnCompleteNext.addEventListener('click', () => {
        const current = this.topics[this.currentTopicIndex];
        if (current) this.toggleComplete(current.id, true);
        this.nextTopic();
      });
    }
    if (btnLaunchLab) {
      btnLaunchLab.addEventListener('click', () => {
        const current = this.topics[this.currentTopicIndex];
        if (current && current.labTemplate) {
          this.launchLab(current.labTemplate);
        }
      });
    }

    // Copy CLI button delegation
    const detailPanel = document.getElementById('study-detail-panel');
    if (detailPanel) {
      detailPanel.addEventListener('click', (e) => {
        if (e.target.closest('#btn-copy-cli')) {
          this.copyCLISnippet();
        }
        if (e.target.closest('#btn-toggle-topic-complete')) {
          const current = this.topics[this.currentTopicIndex];
          if (current) {
            const isCurrentlyComplete = this.completedTopics.has(current.id);
            this.toggleComplete(current.id, !isCurrentlyComplete);
            this.renderLessonDetail();
            this.renderSidebar();
          }
        }
      });
    }

    this.updateProgressIndicator();
    this.renderSidebar();
    this.renderLessonDetail();
  }

  openAcademy(topicId = null) {
    if (topicId) {
      const idx = this.topics.findIndex(t => t.id === topicId);
      if (idx !== -1) this.currentTopicIndex = idx;
    }
    if (this.modal) {
      this.modal.classList.remove('hidden');
    }
    this.renderLessonDetail();
    this.renderSidebar();
  }

  closeAcademy() {
    if (this.modal) {
      this.modal.classList.add('hidden');
    }
  }

  prevTopic() {
    if (this.currentTopicIndex > 0) {
      this.selectTopicByIndex(this.currentTopicIndex - 1);
    }
  }

  nextTopic() {
    if (this.currentTopicIndex < this.topics.length - 1) {
      this.selectTopicByIndex(this.currentTopicIndex + 1);
    }
  }

  selectTopicByIndex(index) {
    if (index >= 0 && index < this.topics.length) {
      this.currentTopicIndex = index;
      const topic = this.topics[index];
      try {
        localStorage.setItem(STORAGE_KEY_LAST_TOPIC, topic.id);
      } catch (e) {}
      this.renderSidebar();
      this.renderLessonDetail();

      // Scroll detail view to top
      const scrollContainer = document.getElementById('study-detail-scroll');
      if (scrollContainer) scrollContainer.scrollTop = 0;
    }
  }

  toggleComplete(topicId, markAsComplete) {
    if (markAsComplete) {
      this.completedTopics.add(topicId);
    } else {
      this.completedTopics.delete(topicId);
    }
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify([...this.completedTopics]));
    } catch (e) {}
    this.updateProgressIndicator();
    this.renderSidebar();
  }

  updateProgressIndicator() {
    const total = this.topics.length;
    const done = this.completedTopics.size;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    if (this.progressFill) {
      this.progressFill.style.width = `${pct}%`;
    }
    if (this.progressLabel) {
      this.progressLabel.textContent = `${done} / ${total} Lessons Completed (${pct}%)`;
    }
  }

  launchLab(labTemplateKey) {
    if (!this.app || !labTemplateKey) return;

    // Load template in 3D scene
    this.app.loadTemplate(labTemplateKey);

    // Sync template selector dropdown
    const select = document.getElementById('template-select');
    if (select) select.value = labTemplateKey;

    // Show feedback toast
    if (this.app.menuManager) {
      this.app.menuManager.setStatus(`🚀 3D Lab Loaded: [${labTemplateKey.toUpperCase()}]. Explore the nodes in 3D!`, 'success');
    }

    // Optionally minimize modal slightly so user can view the 3D scene
    this.closeAcademy();
  }

  copyCLISnippet() {
    const current = this.topics[this.currentTopicIndex];
    if (!current || !current.cliSnippet) return;

    navigator.clipboard.writeText(current.cliSnippet).then(() => {
      const copyBtn = document.getElementById('btn-copy-cli');
      if (copyBtn) {
        copyBtn.textContent = '✓ Copied to Clipboard!';
        copyBtn.style.background = '#10b981';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copy CLI Commands';
          copyBtn.style.background = '';
        }, 2200);
      }
    }).catch(err => {
      console.warn('Clipboard write failed:', err);
    });
  }

  renderSidebar() {
    if (!this.sidebarList) return;

    let filtered = this.topics.filter(topic => {
      // Track filter
      if (this.activeTrackFilter !== 'ALL' && topic.track !== this.activeTrackFilter) {
        return false;
      }
      // Search query
      if (this.searchQuery) {
        const fullText = `${topic.track} ${topic.module} ${topic.badge} ${topic.title} ${topic.summary} ${topic.cliSnippet}`.toLowerCase();
        if (!fullText.includes(this.searchQuery)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      this.sidebarList.innerHTML = `<div class="study-empty-search">No topics found matching "${this.searchQuery}"</div>`;
      return;
    }

    // Group filtered topics by Track -> Module
    let html = '';
    let currentModule = '';

    filtered.forEach(topic => {
      if (topic.module !== currentModule) {
        currentModule = topic.module;
        html += `<div class="study-module-header">${topic.track.split(' ')[0]} - ${topic.module}</div>`;
      }

      const isSelected = this.topics[this.currentTopicIndex]?.id === topic.id;
      const isDone = this.completedTopics.has(topic.id);

      html += `
        <div class="study-sidebar-item ${isSelected ? 'selected' : ''} ${isDone ? 'completed' : ''}" data-topic-id="${topic.id}">
          <div class="study-item-status">
            ${isDone ? '<span class="status-check">✓</span>' : '<span class="status-pending">○</span>'}
          </div>
          <div class="study-item-info">
            <div class="study-item-badge">${topic.badge}</div>
            <div class="study-item-title">${topic.title}</div>
          </div>
        </div>
      `;
    });

    this.sidebarList.innerHTML = html;

    // Attach click events to sidebar items
    this.sidebarList.querySelectorAll('.study-sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.topicId;
        const index = this.topics.findIndex(t => t.id === id);
        if (index !== -1) {
          this.selectTopicByIndex(index);
        }
      });
    });
  }

  renderLessonDetail() {
    const topic = this.topics[this.currentTopicIndex];
    if (!topic) return;

    const isDone = this.completedTopics.has(topic.id);
    const detailPanel = document.getElementById('study-detail-panel');
    if (!detailPanel) return;

    // Safe color based on track
    let trackColor = '#00f3ff';
    if (topic.track.includes('ENCOR')) trackColor = '#f59e0b';
    if (topic.track.includes('ENARSI')) trackColor = '#ef4444';

    detailPanel.innerHTML = `
      <div id="study-detail-scroll" class="study-detail-scroll">
        <!-- Breadcrumb & Top Action -->
        <div class="study-detail-header">
          <div class="study-breadcrumb">
            <span style="color: ${trackColor}; font-weight: bold;">${topic.track}</span>
            <span>&nbsp;&rsaquo;&nbsp;</span>
            <span>${topic.module}</span>
            <span>&nbsp;&rsaquo;&nbsp;</span>
            <span class="study-badge-tag">${topic.badge}</span>
          </div>
          <button id="btn-toggle-topic-complete" class="btn-tool-sm ${isDone ? 'btn-complete-active' : ''}">
            ${isDone ? '✓ Completed' : '○ Mark as Completed'}
          </button>
        </div>

        <h1 class="study-lesson-title">${topic.title}</h1>
        <p class="study-lesson-summary">${topic.summary}</p>

        <!-- Real-World Analogy Box -->
        <div class="study-analogy-box">
          <div class="study-analogy-header">
            <span class="analogy-icon">💡</span>
            <strong>Beginner Mental Model & Real-World Analogy</strong>
          </div>
          <p class="study-analogy-text">${topic.analogy}</p>
        </div>

        <!-- Interactive Architectural / Header Diagram -->
        <div class="study-diagram-box">
          <div class="study-box-title">📐 Visual Architecture & Packet Diagram</div>
          <div class="study-svg-container">
            ${topic.diagramSvg}
          </div>
        </div>

        <!-- Deep-Dive Engineering Theory -->
        <div class="study-deepdive-box">
          <div class="study-box-title">🔬 Deep-Dive Technical Engineering</div>
          <div class="study-theory-content">
            ${topic.deepDive}
          </div>
        </div>

        <!-- Real Cisco IOS CLI Snippet -->
        <div class="study-cli-box">
          <div class="study-cli-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color: #00f3ff;">🖥️</span>
              <strong>Real Cisco IOS CLI Configuration & Verification</strong>
            </div>
            <button id="btn-copy-cli" class="btn-tool-sm">📋 Copy CLI Commands</button>
          </div>
          <pre class="study-cli-code"><code>${this.escapeHtml(topic.cliSnippet)}</code></pre>
        </div>

        <!-- Exam Tip Alert Box -->
        <div class="study-exam-tip-box">
          <div class="study-exam-tip-header">
            <span>🎯</span>
            <strong>Cisco Certification Exam Tip (CCNA / CCNP Trap)</strong>
          </div>
          <p class="study-exam-tip-text">${topic.examTip}</p>
        </div>
      </div>
    `;

    // Update Bottom Action Bar
    const btnPrev = document.getElementById('btn-study-prev');
    const btnNext = document.getElementById('btn-study-next');
    const btnLaunchLab = document.getElementById('btn-study-launch-lab');

    if (btnPrev) {
      btnPrev.disabled = this.currentTopicIndex === 0;
      btnPrev.textContent = this.currentTopicIndex > 0 
        ? `← ${this.topics[this.currentTopicIndex - 1].badge}` 
        : '← Previous Topic';
    }
    if (btnNext) {
      btnNext.disabled = this.currentTopicIndex === this.topics.length - 1;
      btnNext.textContent = this.currentTopicIndex < this.topics.length - 1 
        ? `${this.topics[this.currentTopicIndex + 1].badge} →` 
        : 'Next Topic →';
    }
    if (btnLaunchLab) {
      btnLaunchLab.innerHTML = `🚀 Launch 3D Lab Scene: <strong>[${topic.labTemplate.toUpperCase()}]</strong>`;
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
