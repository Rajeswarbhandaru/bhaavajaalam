// dragdrop.js — pointer-based drag and drop for part installation (touch + mouse, no libs)
export class DragDropManager {
  constructor(onDrop) {
    this.onDrop = onDrop;
    this.dragging = null;
    this.ghost = null;
    this._bindGlobal();
  }

  _bindGlobal() {
    document.addEventListener("pointermove", (e) => {
      if (!this.dragging || !this.ghost) return;
      this.ghost.style.left = `${e.clientX - this._offX}px`;
      this.ghost.style.top = `${e.clientY - this._offY}px`;
      this._updateHoverState(e.clientX, e.clientY);
    });

    document.addEventListener("pointerup", (e) => {
      if (!this.dragging) return;
      const dropZone = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-dropzone='true']");
      this._clearHoverStates();
      if (dropZone) {
        this.onDrop({
          partId: this.dragging.partId,
          part: this.dragging.part,
          fromSlot: this.dragging.slot,
          targetSlot: dropZone.dataset.slot,
          dropZoneEl: dropZone
        });
        // Prevent the browser's following click event from installing a second time.
        this.dragging.el.dispatchEvent(new CustomEvent("part-dropped", { bubbles: false }));
      }
      this._endDrag();
    });

    document.addEventListener("pointercancel", () => this._endDrag());
  }

  _updateHoverState(x, y) {
    this._clearHoverStates();
    const el = document.elementFromPoint(x, y)?.closest("[data-dropzone='true']");
    if (el) el.classList.add("dropzone-hover");
    document.querySelectorAll("[data-dropzone='true']").forEach(z => {
      if (z !== el) z.classList.add("dropzone-active");
    });
  }

  _clearHoverStates() {
    document.querySelectorAll("[data-dropzone='true']").forEach(z => {
      z.classList.remove("dropzone-hover", "dropzone-active");
    });
  }

  _endDrag() {
    if (this.dragging?.el) this.dragging.el.classList.remove("dragging");
    if (this.ghost) { this.ghost.remove(); this.ghost = null; }
    this.dragging = null;
  }

  startDrag(el, partId, part, slot, pointerEvent) {
    this.dragging = { el, partId, part, slot };
    el.classList.add("dragging");
    const rect = el.getBoundingClientRect();
    this._offX = pointerEvent.clientX - rect.left;
    this._offY = pointerEvent.clientY - rect.top;
    this.ghost = el.cloneNode(true);
    this.ghost.classList.add("drag-ghost");
    this.ghost.style.width = `${rect.width}px`;
    this.ghost.style.position = "fixed";
    this.ghost.style.left = `${rect.left}px`;
    this.ghost.style.top = `${rect.top}px`;
    document.body.appendChild(this.ghost);
  }

  makeDraggable(el, partId, part, slot) {
    el.dataset.draggable = "true";
    el.dataset.partId = partId;
    el.dataset.slot = slot;
    let startedAt = null;
    el.addEventListener("pointerdown", (e) => {
      if (el.classList.contains("locked")) return;
      e.preventDefault();
      startedAt = { x: e.clientX, y: e.clientY };
      this.startDrag(el, partId, part, slot, e);
    });
    // Keyboard alternative: focus a part and press Enter or Space to install it in its matching slot.
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Install ${part.name}`);
    el.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      const zone = document.querySelector(`[data-dropzone='true'][data-slot='${slot}']`);
      if (zone) this.onDrop({ partId, part, fromSlot: slot, targetSlot: slot, dropZoneEl: zone });
    });
    el.addEventListener("part-dropped", () => { startedAt = null; });
    // Tap/click fallback: a short click installs the part automatically into the identically labelled slot.
    el.addEventListener("click", (e) => {
      if (!startedAt) return;
      const zone = document.querySelector(`[data-dropzone='true'][data-slot='${slot}']`);
      if (zone) this.onDrop({ partId, part, fromSlot: slot, targetSlot: slot, dropZoneEl: zone });
      startedAt = null;
    });
  }

  makeDropZone(el, slot) {
    el.dataset.dropzone = "true";
    el.dataset.slot = slot;
  }
}
