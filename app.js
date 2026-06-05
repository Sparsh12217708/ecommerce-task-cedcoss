// Seed Data for Mock Orders
const SEED_ORDERS = [
  {
    id: "RE-8902",
    date: "June 02, 2026",
    status: "Delivered", // Delivered, Return Requested, Approved, Refund Processed
    total: 129.99,
    items: [
      {
        id: "p1",
        name: "Ultra-Bass Wireless Headphones",
        desc: "Over-ear, Active Noise Cancelling, Midnight Black",
        price: 129.99,
        qty: 1,
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "RE-7104",
    date: "June 04, 2026",
    status: "Delivered",
    total: 174.98,
    items: [
      {
        id: "p3",
        name: "Ergonomic Mechanical Keyboard",
        desc: "Tactile Brown Switches, RGB Backlit, Aluminum Frame",
        price: 149.99,
        qty: 1,
        img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80"
      },
      {
        id: "p4",
        name: "Precision Mouse Pad (Large)",
        desc: "Waterproof, Anti-fray stitched edges, Obsidian Dark",
        price: 24.99,
        qty: 1,
        img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "RE-4491",
    date: "May 28, 2026",
    status: "Delivered",
    total: 199.99,
    items: [
      {
        id: "p5",
        name: "Smart Fitness Watch V2",
        desc: "AMOLED Display, 24/7 Heart Rate Tracker, Slate Silver",
        price: 199.99,
        qty: 1,
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "RE-3112",
    date: "May 12, 2026",
    status: "Delivered",
    total: 89.99,
    items: [
      {
        id: "p6",
        name: "Noise-Cancelling Earbuds",
        desc: "Sweatproof, Touch Controls, 24-hr Battery, Pure White",
        price: 89.99,
        qty: 1,
        img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&auto=format&fit=crop&q=80"
      }
    ]
  }
];

// App State
let orders = [];
let currentUploadedFiles = [];
let activeFilter = "all";

// DOM Elements
const ordersContainer = document.getElementById("orders-container");
const returnModal = document.getElementById("return-modal");
const detailsModal = document.getElementById("details-modal");
const returnForm = document.getElementById("return-form");
const imageDropzone = document.getElementById("image-dropzone");
const imageInput = document.getElementById("image-input");
const uploadedFilesPreview = document.getElementById("uploaded-files-preview");
const photoUploadGroup = document.getElementById("photo-upload-group");

// Buttons & Control elements
const closeReturnModalBtn = document.getElementById("close-return-modal");
const btnCancelReturn = document.getElementById("btn-cancel-return");
const btnSubmitReturn = document.getElementById("btn-submit-return");
const btnCloseSuccess = document.getElementById("btn-close-success");

const closeDetailsModalBtn = document.getElementById("close-details-modal");
const btnCloseDetails = document.getElementById("btn-close-details");

const adminSimPanel = document.getElementById("admin-sim-panel");
const btnToggleSim = document.getElementById("btn-toggle-sim");
const btnCloseSim = document.getElementById("btn-close-sim");
const simOrderSelect = document.getElementById("sim-order-select");
const simBtnApprove = document.getElementById("sim-btn-approve");
const simBtnRefund = document.getElementById("sim-btn-refund");
const simBtnReset = document.getElementById("sim-btn-reset");

// Toast elements
const toastContainer = document.getElementById("toast-container");

// Initialize application
function init() {
  const savedOrders = localStorage.getItem("returneasy_orders");
  if (savedOrders) {
    orders = JSON.parse(savedOrders);
  } else {
    orders = JSON.parse(JSON.stringify(SEED_ORDERS));
    saveToStorage();
  }

  setupEventListeners();
  renderStats();
  renderOrders(activeFilter);
  populateAdminSelect();
}

function saveToStorage() {
  localStorage.setItem("returneasy_orders", JSON.stringify(orders));
}

// Show toast notifications
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  toastContainer.appendChild(toast);
  
  toastContainer.classList.add("show");
  
  setTimeout(() => {
    toast.style.animation = "fadeIn 0.3s ease reverse forwards";
    setTimeout(() => {
      toast.remove();
      if (toastContainer.children.length === 0) {
        toastContainer.classList.remove("show");
      }
    }, 300);
  }, 3000);
}

// Update stats count in dashboard
function renderStats() {
  const total = orders.length;
  const delivered = orders.filter(o => o.status === "Delivered").length;
  const requested = orders.filter(o => o.status === "Return Requested").length;
  const approved = orders.filter(o => o.status === "Approved").length;
  const refunded = orders.filter(o => o.status === "Refund Processed").length;

  document.getElementById("stat-total-orders").querySelector(".stat-value").innerText = total;
  document.getElementById("stat-delivered").querySelector(".stat-value").innerText = delivered;
  document.getElementById("stat-returned").querySelector(".stat-value").innerText = requested + approved;
  document.getElementById("stat-refunded").querySelector(".stat-value").innerText = refunded;
}

// Render the grid of orders
function renderOrders(filter) {
  ordersContainer.innerHTML = "";
  
  const filteredOrders = orders.filter(o => {
    if (filter === "all") return true;
    if (filter === "delivered") return o.status === "Delivered";
    if (filter === "returns") return ["Return Requested", "Approved", "Refund Processed"].includes(o.status);
    return true;
  });

  if (filteredOrders.length === 0) {
    ordersContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary); background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: 20px;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">📦</span>
        <p style="font-weight: 500;">No orders found matching this filter.</p>
      </div>
    `;
    return;
  }

  filteredOrders.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";
    
    // Status color mapping
    let statusClass = "status-delivered";
    if (order.status === "Return Requested") statusClass = "status-requested";
    else if (order.status === "Approved") statusClass = "status-approved";
    else if (order.status === "Refund Processed") statusClass = "status-refunded";

    // Item layouts
    const itemsHtml = order.items.map(item => `
      <div class="product-row">
        <img class="product-img" src="${item.img}" alt="${item.name}">
        <div class="product-info">
          <h4 class="product-name">${item.name}</h4>
          <p class="product-desc">${item.desc}</p>
          <div class="product-price-qty">
            Qty: <span>${item.qty}</span> &nbsp;|&nbsp; Price: <span>$${item.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `).join("");

    // Footer actions depending on status
    let footerActions = "";
    if (order.status === "Delivered") {
      footerActions = `
        <button class="btn btn-secondary" onclick="openDetailsModal('${order.id}')">View Details</button>
        <button class="btn btn-primary" onclick="openReturnModal('${order.id}')">Return Items</button>
      `;
    } else {
      footerActions = `
        <span style="color: var(--text-secondary); font-size: 0.85rem; display: flex; align-items: center; gap: 0.25rem;">
          🔄 Return in progress
        </span>
        <button class="btn btn-primary" onclick="openDetailsModal('${order.id}')">Track Return</button>
      `;
    }

    card.innerHTML = `
      <div class="order-card-header">
        <div class="order-meta">
          <div class="meta-group">
            <span class="meta-label">Order ID</span>
            <span class="meta-value order-id">${order.id}</span>
          </div>
          <div class="meta-group">
            <span class="meta-label">Placed On</span>
            <span class="meta-value">${order.date}</span>
          </div>
          <div class="meta-group">
            <span class="meta-label">Total Amount</span>
            <span class="meta-value">$${order.total.toFixed(2)}</span>
          </div>
        </div>
        <span class="status-badge ${statusClass}">${order.status}</span>
      </div>
      <div class="order-items">
        ${itemsHtml}
      </div>
      <div class="order-card-footer">
        ${footerActions}
      </div>
    `;

    ordersContainer.appendChild(card);
  });
}

// Populate order choices in the Simulator Select dropdown
function populateAdminSelect() {
  simOrderSelect.innerHTML = `<option value="" disabled selected>Select an active return...</option>`;
  
  const returnOrders = orders.filter(o => ["Return Requested", "Approved"].includes(o.status));
  
  if (returnOrders.length === 0) {
    simOrderSelect.innerHTML = `<option value="">No active returns to manage</option>`;
    simBtnApprove.disabled = true;
    simBtnRefund.disabled = true;
    return;
  }

  returnOrders.forEach(order => {
    const option = document.createElement("option");
    option.value = order.id;
    option.text = `${order.id} (${order.status})`;
    simOrderSelect.appendChild(option);
  });

  // Enable/disable buttons depending on selected order state
  updateAdminButtons();
}

function updateAdminButtons() {
  const selectedOrderId = simOrderSelect.value;
  if (!selectedOrderId) {
    simBtnApprove.disabled = true;
    simBtnRefund.disabled = true;
    return;
  }

  const order = orders.find(o => o.id === selectedOrderId);
  if (!order) return;

  if (order.status === "Return Requested") {
    simBtnApprove.disabled = false;
    simBtnRefund.disabled = true;
  } else if (order.status === "Approved") {
    simBtnApprove.disabled = true;
    simBtnRefund.disabled = false;
  } else {
    simBtnApprove.disabled = true;
    simBtnRefund.disabled = true;
  }
}

// Event handlers for Return Request Modal
function openReturnModal(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  // Reset form states
  returnForm.reset();
  currentUploadedFiles = [];
  uploadedFilesPreview.innerHTML = "";
  photoUploadGroup.style.display = "none";
  document.getElementById("item-selection-error").style.display = "none";
  document.getElementById("photo-error").style.display = "none";

  // Modal Views
  document.getElementById("return-form-state").style.display = "block";
  document.getElementById("return-success-state").style.display = "none";
  document.getElementById("modal-actions-footer").style.display = "flex";
  document.getElementById("modal-success-footer").style.display = "none";

  // Fill in variables
  document.getElementById("form-order-id").value = orderId;
  document.getElementById("return-modal-title").innerText = `Initiate Return: Order #${orderId}`;

  // Populate order items inside form selection
  const selector = document.getElementById("form-item-selector");
  selector.innerHTML = "";

  order.items.forEach(item => {
    const itemRow = document.createElement("div");
    itemRow.className = "selector-row";
    itemRow.innerHTML = `
      <label class="selector-checkbox-label">
        <input type="checkbox" name="return-item" value="${item.id}" data-max-qty="${item.qty}">
        <span class="checkbox-custom"></span>
        <span style="font-weight: 500;">${item.name}</span>
      </label>
      <div class="quantity-picker" style="opacity: 0.5; pointer-events: none;">
        <button type="button" class="qty-btn qty-minus" onclick="adjustQty('${item.id}', -1)">-</button>
        <span class="qty-val" id="qty-val-${item.id}">1</span>
        <button type="button" class="qty-btn qty-plus" onclick="adjustQty('${item.id}', 1)">+</button>
      </div>
    `;

    // Add checkbox toggle listener to enable quantity picker
    const checkbox = itemRow.querySelector('input[type="checkbox"]');
    const qtyPicker = itemRow.querySelector('.quantity-picker');
    
    checkbox.addEventListener("change", function() {
      if (this.checked) {
        qtyPicker.style.opacity = "1";
        qtyPicker.style.pointerEvents = "auto";
      } else {
        qtyPicker.style.opacity = "0.5";
        qtyPicker.style.pointerEvents = "none";
        document.getElementById(`qty-val-${item.id}`).innerText = "1";
      }
    });

    selector.appendChild(itemRow);
  });

  returnModal.classList.add("active");
}

function adjustQty(itemId, val) {
  const valEl = document.getElementById(`qty-val-${itemId}`);
  const checkbox = document.querySelector(`input[value="${itemId}"]`);
  if (!checkbox) return;

  const maxQty = parseInt(checkbox.getAttribute("data-max-qty"));
  let currentQty = parseInt(valEl.innerText);

  currentQty += val;
  if (currentQty < 1) currentQty = 1;
  if (currentQty > maxQty) currentQty = maxQty;

  valEl.innerText = currentQty;
}

function closeReturnModal() {
  returnModal.classList.remove("active");
}

// Event handlers for Details Modal
function openDetailsModal(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById("details-modal-title").innerText = `Order Status: #${order.id}`;
  
  // Populate Placed date
  document.getElementById("step-placed-date").innerText = order.date;

  // Set Stepper Status Tracker Timeline
  const stepperProgress = document.getElementById("stepper-progress");
  const stepPlaced = document.getElementById("step-placed");
  const stepRequested = document.getElementById("step-requested");
  const stepApproved = document.getElementById("step-approved");
  const stepRefunded = document.getElementById("step-refunded");

  // Reset all steps to initial state
  [stepPlaced, stepRequested, stepApproved, stepRefunded].forEach(s => {
    s.classList.remove("active", "completed");
  });

  if (order.status === "Delivered") {
    stepPlaced.classList.add("active");
    stepperProgress.style.width = "0%";
    document.getElementById("step-requested-date").innerText = "Not Requested";
    document.getElementById("step-approved-date").innerText = "Pending Review";
    document.getElementById("step-refunded-date").innerText = "Refund Issued";
    document.getElementById("details-return-section").style.display = "none";
  } else {
    // If Return Requested, Approved, or Refunded
    document.getElementById("details-return-section").style.display = "block";
    document.getElementById("details-return-reason").innerText = order.returnDetails.reason;
    document.getElementById("details-return-date").innerText = order.returnDetails.requestDate;
    document.getElementById("details-return-comments").innerText = order.returnDetails.comments || "None";
    
    // Returned items summary
    const returnedItemsSummary = order.returnDetails.items.map(i => `${i.name} (x${i.qty})`).join(", ");
    document.getElementById("details-return-items").innerText = returnedItemsSummary;

    // Load uploaded proof thumbnails if present
    const proofBlock = document.getElementById("details-return-proof-block");
    const proofImgsContainer = document.getElementById("details-return-proof-imgs");
    proofImgsContainer.innerHTML = "";

    if (order.returnDetails.proof && order.returnDetails.proof.length > 0) {
      proofBlock.style.display = "block";
      order.returnDetails.proof.forEach(filename => {
        const thumb = document.createElement("div");
        thumb.className = "uploaded-file-item";
        thumb.style.padding = "0.25rem 0.5rem";
        thumb.innerHTML = `📄 ${filename}`;
        proofImgsContainer.appendChild(thumb);
      });
    } else {
      proofBlock.style.display = "none";
    }

    // Process Timeline State Nodes
    stepPlaced.classList.add("completed");
    document.getElementById("step-requested-date").innerText = order.returnDetails.requestDate;

    if (order.status === "Return Requested") {
      stepRequested.classList.add("active");
      stepperProgress.style.width = "33%";
      document.getElementById("step-approved-date").innerText = "Pending Approval";
      document.getElementById("step-refunded-date").innerText = "Pending Refund";
    } else if (order.status === "Approved") {
      stepRequested.classList.add("completed");
      stepApproved.classList.add("active");
      stepperProgress.style.width = "66%";
      document.getElementById("step-approved-date").innerText = "Approved for Refund";
      document.getElementById("step-refunded-date").innerText = "Processing Refund";
    } else if (order.status === "Refund Processed") {
      stepRequested.classList.add("completed");
      stepApproved.classList.add("completed");
      stepRefunded.classList.add("completed");
      stepperProgress.style.width = "100%";
      document.getElementById("step-approved-date").innerText = "Approved";
      document.getElementById("step-refunded-date").innerText = "Refund Issued";
    }
  }

  // Populate items list
  const listContainer = document.getElementById("details-items-list");
  listContainer.innerHTML = "";
  
  order.items.forEach(item => {
    const isReturned = order.returnDetails && order.returnDetails.items.some(ri => ri.id === item.id);
    const returnedBadge = isReturned 
      ? `<span class="status-badge status-requested" style="font-size: 0.65rem; padding: 0.15rem 0.5rem; margin-left: 0.5rem;">Returning</span>` 
      : "";
    
    const row = document.createElement("div");
    row.className = "product-row";
    row.innerHTML = `
      <img class="product-img" src="${item.img}" alt="${item.name}">
      <div class="product-info">
        <h4 class="product-name" style="display:flex; align-items:center;">${item.name} ${returnedBadge}</h4>
        <p class="product-desc">${item.desc}</p>
        <div class="product-price-qty">
          Qty: <span>${item.qty}</span> &nbsp;|&nbsp; Price: <span>$${item.price.toFixed(2)}</span>
        </div>
      </div>
    `;
    listContainer.appendChild(row);
  });

  detailsModal.classList.add("active");
}

function closeDetailsModal() {
  detailsModal.classList.remove("active");
}

// Submission handler for return requests
function submitReturnRequest() {
  const orderId = document.getElementById("form-order-id").value;
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return;

  const order = orders[orderIndex];

  // Validate items selection
  const selectedCheckboxes = document.querySelectorAll('input[name="return-item"]:checked');
  if (selectedCheckboxes.length === 0) {
    document.getElementById("item-selection-error").style.display = "block";
    return;
  } else {
    document.getElementById("item-selection-error").style.display = "none";
  }

  // Reason selector
  const reasonSelect = document.getElementById("return-reason");
  if (!reasonSelect.value) {
    reasonSelect.focus();
    return;
  }

  // Validate proof condition if "Damaged"
  if (reasonSelect.value === "Damaged" && currentUploadedFiles.length === 0) {
    document.getElementById("photo-error").style.display = "block";
    return;
  } else {
    document.getElementById("photo-error").style.display = "none";
  }

  // Prepare returned items list
  const returnedItems = [];
  selectedCheckboxes.forEach(cb => {
    const itemId = cb.value;
    const item = order.items.find(i => i.id === itemId);
    const qtyVal = parseInt(document.getElementById(`qty-val-${itemId}`).innerText);
    returnedItems.push({
      id: itemId,
      name: item.name,
      qty: qtyVal
    });
  });

  const comments = document.getElementById("return-comments").value;
  const today = new Date();
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  // Set return state details
  order.status = "Return Requested";
  order.returnDetails = {
    requestDate: formattedDate,
    reason: reasonSelect.value,
    comments: comments,
    items: returnedItems,
    proof: currentUploadedFiles.map(f => f.name)
  };

  // Save State and Re-render UI dashboard
  saveToStorage();
  renderStats();
  renderOrders(activeFilter);
  populateAdminSelect();

  // Swap to success screen view in modal
  document.getElementById("success-state-msg").innerText = `Your return request for Order #${order.id} has been submitted successfully. Our support agents are reviewing your details.`;
  document.getElementById("return-form-state").style.display = "none";
  document.getElementById("return-success-state").style.display = "block";
  document.getElementById("modal-actions-footer").style.display = "none";
  document.getElementById("modal-success-footer").style.display = "flex";

  showToast(`Return request submitted for Order #${order.id}`);

  // Auto trigger details modal when they click the Close button
  btnCloseSuccess.onclick = function() {
    closeReturnModal();
    setTimeout(() => {
      openDetailsModal(orderId);
    }, 400);
  };
}

// Simulate Status changes through simulator
function simulateStatusChange(newStatus) {
  const selectedOrderId = simOrderSelect.value;
  if (!selectedOrderId) {
    showToast("Please select an order to simulate changes.");
    return;
  }

  const orderIndex = orders.findIndex(o => o.id === selectedOrderId);
  if (orderIndex === -1) return;

  orders[orderIndex].status = newStatus;
  saveToStorage();
  
  showToast(`Order #${selectedOrderId} status updated to: ${newStatus}`);
  
  renderStats();
  renderOrders(activeFilter);
  populateAdminSelect();
  
  // If Details Modal is currently open for this order, refresh its view details
  if (detailsModal.classList.contains("active")) {
    const detailsTitle = document.getElementById("details-modal-title").innerText;
    if (detailsTitle.includes(selectedOrderId)) {
      openDetailsModal(selectedOrderId);
    }
  }
}

// Reset localStorage database
function resetData() {
  localStorage.removeItem("returneasy_orders");
  orders = JSON.parse(JSON.stringify(SEED_ORDERS));
  saveToStorage();
  
  showToast("Dashboard reset to initial seed data!");
  
  renderStats();
  renderOrders(activeFilter);
  populateAdminSelect();
  
  closeReturnModal();
  closeDetailsModal();
}

// Event Listeners setup
function setupEventListeners() {
  // Modal buttons
  closeReturnModalBtn.addEventListener("click", closeReturnModal);
  btnCancelReturn.addEventListener("click", closeReturnModal);
  btnSubmitReturn.addEventListener("click", submitReturnRequest);

  closeDetailsModalBtn.addEventListener("click", closeDetailsModal);
  btnCloseDetails.addEventListener("click", closeDetailsModal);

  // Dynamic filter clicks
  const filters = document.querySelectorAll(".filter-btn");
  filters.forEach(btn => {
    btn.addEventListener("click", function() {
      filters.forEach(f => f.classList.remove("btn-active"));
      this.classList.add("btn-active");
      activeFilter = this.getAttribute("data-filter");
      renderOrders(activeFilter);
    });
  });

  // Photo Dropzone and file selections
  imageDropzone.addEventListener("click", () => imageInput.click());
  
  imageDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    imageDropzone.style.borderColor = "var(--primary)";
  });

  imageDropzone.addEventListener("dragleave", () => {
    imageDropzone.style.borderColor = "var(--border-color)";
  });

  imageDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    imageDropzone.style.borderColor = "var(--border-color)";
    handleFiles(e.dataTransfer.files);
  });

  imageInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });

  // Conditional field display for "Damaged" reason selection
  const reasonSelect = document.getElementById("return-reason");
  reasonSelect.addEventListener("change", function() {
    if (this.value === "Damaged") {
      photoUploadGroup.style.display = "block";
    } else {
      photoUploadGroup.style.display = "none";
      document.getElementById("photo-error").style.display = "none";
    }
  });

  // Admin panel expanders and toggles
  btnToggleSim.addEventListener("click", () => {
    adminSimPanel.classList.toggle("open");
  });

  btnCloseSim.addEventListener("click", () => {
    adminSimPanel.classList.remove("open");
  });

  simOrderSelect.addEventListener("change", updateAdminButtons);

  simBtnApprove.addEventListener("click", () => {
    simulateStatusChange("Approved");
  });

  simBtnRefund.addEventListener("click", () => {
    simulateStatusChange("Refund Processed");
  });

  simBtnReset.addEventListener("click", resetData);
}

// Upload file list helpers
function handleFiles(filesList) {
  for (let i = 0; i < filesList.length; i++) {
    const file = filesList[i];
    
    // Avoid double uploads
    if (currentUploadedFiles.some(f => f.name === file.name)) continue;

    currentUploadedFiles.push(file);

    const fileRow = document.createElement("div");
    fileRow.className = "uploaded-file-item";
    fileRow.id = `file-${file.name.replace(/[^a-zA-Z0-9]/g, "_")}`;
    fileRow.innerHTML = `
      <span>📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
      <button type="button" class="file-remove-btn" onclick="removeFile('${file.name}')">&times;</button>
    `;
    uploadedFilesPreview.appendChild(fileRow);
  }

  if (currentUploadedFiles.length > 0) {
    document.getElementById("photo-error").style.display = "none";
  }
}

// Global scope file remover so onclick works
window.removeFile = function(fileName) {
  currentUploadedFiles = currentUploadedFiles.filter(f => f.name !== fileName);
  const rowId = `file-${fileName.replace(/[^a-zA-Z0-9]/g, "_")}`;
  const el = document.getElementById(rowId);
  if (el) el.remove();
};

// Start application
document.addEventListener("DOMContentLoaded", init);
