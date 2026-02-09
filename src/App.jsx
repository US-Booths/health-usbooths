import { useState, useEffect } from 'react'

const API_BASE_URL = 'https://api.usbooths.com'
const NOTIFICATION_EMAIL = 'mayo@usbooths.com'

// Endpoints organizados por categoría con críticos y todos
const ENDPOINTS = {
  'PUBLIC API': {
    critical: [
      { name: 'Health Check', path: '/api/health', method: 'GET' },
      { name: 'Login', path: '/api/login', method: 'POST' },
      { name: 'Register', path: '/api/register', method: 'POST' },
    ],
    all: [
      { name: 'Health Check', path: '/api/health', method: 'GET' },
      { name: 'Login', path: '/api/login', method: 'POST' },
      { name: 'Register', path: '/api/register', method: 'POST' },
      { name: 'Forgot Password', path: '/api/forgot-password', method: 'POST' },
      { name: 'Reset Password', path: '/api/reset-password', method: 'POST' },
      { name: 'Approve Pool Order', path: '/api/approve-pool-order', method: 'POST' },
      { name: 'Cancel Reset Password', path: '/api/cancel-reset-password', method: 'POST' },
      { name: 'Save Received SMS', path: '/api/sms-call/save-received-sms', method: 'POST' },
      { name: 'Save Sent SMS', path: '/api/sms-call/save-sent-sms', method: 'POST' },
      { name: 'Active Workstations', path: '/api/workstations/activeToLogin', method: 'GET' },
      { name: 'Admin Header Data', path: '/api/admin/header-data', method: 'GET' },
      { name: 'Person Media', path: '/api/admin/person/media/1', method: 'GET' },
      { name: 'QuickBooks Connect Check', path: '/api/admin/quickbooks/connect', method: 'GET' },
      { name: 'QuickBooks Connect', path: '/api/admin/quickbooks/connect', method: 'POST' },
      { name: 'Work Order Files', path: '/api/admin/work-order/files/1', method: 'GET' },
    ]
  },
  'HOME & GALLERY': {
    critical: [
      { name: 'Get Home', path: '/api/home', method: 'GET' },
      { name: 'Get Gallery', path: '/api/gallery', method: 'GET' },
    ],
    all: [
      { name: 'Get Home', path: '/api/home', method: 'GET' },
      { name: 'Get Gallery', path: '/api/gallery', method: 'GET' },
      { name: 'Get Gallery Image', path: '/api/gallery/images/sample', method: 'GET' },
    ]
  },
  'SHOP & CART': {
    critical: [
      { name: 'Get Shop', path: '/api/shop', method: 'GET' },
      { name: 'Get Cart', path: '/api/cart/1', method: 'GET' },
      { name: 'Add to Cart', path: '/api/cart/add', method: 'POST' },
    ],
    all: [
      { name: 'Get Shop', path: '/api/shop', method: 'GET' },
      { name: 'Get Product', path: '/api/shop/product/sample', method: 'GET' },
      { name: 'Get Product Image', path: '/api/shop/product/images/image/sample', method: 'GET' },
      { name: 'Add to Cart', path: '/api/cart/add', method: 'POST' },
      { name: 'Clear Cart', path: '/api/cart/clear', method: 'POST' },
      { name: 'Increase Quantity', path: '/api/cart/increase-quantity', method: 'POST' },
      { name: 'Decrease Quantity', path: '/api/cart/decrease-quantity', method: 'POST' },
      { name: 'Get Cart', path: '/api/cart/1', method: 'GET' },
      { name: 'Remove Cart Item', path: '/api/cart/remove/1/item/1', method: 'DELETE' },
    ]
  },
  'ORDERS & QUOTES': {
    critical: [
      { name: 'Get Orders', path: '/api/orders', method: 'GET' },
      { name: 'Process Order', path: '/api/process-order/1', method: 'POST' },
      { name: 'Create Quote', path: '/api/quote', method: 'POST' },
      { name: 'Get Invoices', path: '/api/invoices', method: 'GET' },
    ],
    all: [
      { name: 'Get Orders', path: '/api/orders', method: 'GET' },
      { name: 'Get Order', path: '/api/order/1', method: 'GET' },
      { name: 'Update Order', path: '/api/order/1', method: 'POST' },
      { name: 'Delete Order', path: '/api/order/1', method: 'DELETE' },
      { name: 'Process Order', path: '/api/process-order/1', method: 'POST' },
      { name: 'Confirm Quote', path: '/api/confirm-quote/1', method: 'POST' },
      { name: 'Confirm Proposal', path: '/api/confirm-proposal', method: 'POST' },
      { name: 'Create Quote', path: '/api/quote', method: 'POST' },
      { name: 'Send Quote', path: '/api/send-quote', method: 'POST' },
      { name: 'Quote Requests', path: '/api/quote-requests', method: 'GET' },
      { name: 'Get Quote Request', path: '/api/quote-request/1', method: 'GET' },
      { name: 'Create Proposal', path: '/api/proposals', method: 'POST' },
      { name: 'Get Proposal', path: '/api/proposals/1', method: 'GET' },
      { name: 'Send Proposal', path: '/api/send-proposal', method: 'POST' },
      { name: 'Get Invoices', path: '/api/invoices', method: 'GET' },
      { name: 'Get Invoice', path: '/api/get-invoice/1', method: 'GET' },
      { name: 'Process Invoice', path: '/api/process-invoice', method: 'POST' },
      { name: 'Send Invoice', path: '/api/send-invoice', method: 'POST' },
      { name: 'Generate Invoice PDF', path: '/api/generate-invoice-pdf/1', method: 'GET' },
      { name: 'Generate Order PDF', path: '/api/generate-order-pdf/1', method: 'GET' },
    ]
  },
  'WORK ORDERS': {
    critical: [
      { name: 'Get Work Orders', path: '/api/work-orders', method: 'GET' },
      { name: 'Create Work Order', path: '/api/work-order', method: 'POST' },
      { name: 'Update Work Order Status', path: '/api/update-status-work-order', method: 'POST' },
    ],
    all: [
      { name: 'Get Work Orders', path: '/api/work-orders', method: 'GET' },
      { name: 'Get Work Order', path: '/api/work-order/1', method: 'GET' },
      { name: 'Create Work Order', path: '/api/work-order', method: 'POST' },
      { name: 'Update Work Order', path: '/api/work-order/1', method: 'PUT' },
      { name: 'Delete Work Order', path: '/api/work-order/1', method: 'DELETE' },
      { name: 'Update Work Order Status', path: '/api/update-status-work-order', method: 'POST' },
      { name: 'Assign Work Order', path: '/api/update-assign-work-order', method: 'POST' },
      { name: 'Take Work Order', path: '/api/take-work-order', method: 'POST' },
      { name: 'Work Order Team', path: '/api/work-order-team/1', method: 'GET' },
      { name: 'Set Team Leader', path: '/api/work-order-team/set-leader', method: 'POST' },
      { name: 'Work Order Notes', path: '/api/work-order-notes', method: 'GET' },
      { name: 'Create Work Order Note', path: '/api/work-order-note', method: 'POST' },
      { name: 'Work Order Files', path: '/api/work-order/files', method: 'POST' },
      { name: 'Pool Orders', path: '/api/pool-orders', method: 'GET' },
      { name: 'Create Pool Order', path: '/api/pool-order', method: 'POST' },
      { name: 'Take Pool Order', path: '/api/take-pool-order', method: 'POST' },
    ]
  },
  'USERS & CONTACTS': {
    critical: [
      { name: 'Get Admins', path: '/api/admins', method: 'GET' },
      { name: 'Get Contacts', path: '/api/contacts', method: 'GET' },
      { name: 'User Profile', path: '/api/user-profile', method: 'GET' },
    ],
    all: [
      { name: 'Get Admins', path: '/api/admins', method: 'GET' },
      { name: 'Create Admin', path: '/api/admin', method: 'POST' },
      { name: 'Get Admin', path: '/api/admin/1', method: 'GET' },
      { name: 'Update Admin', path: '/api/admin/1', method: 'PUT' },
      { name: 'Delete Admin', path: '/api/admin/1', method: 'DELETE' },
      { name: 'Get Contacts', path: '/api/contacts', method: 'GET' },
      { name: 'Active Contacts', path: '/api/contacts/active', method: 'GET' },
      { name: 'Create Client', path: '/api/client', method: 'POST' },
      { name: 'Get Client', path: '/api/client/1', method: 'GET' },
      { name: 'Update Client', path: '/api/client/1', method: 'PUT' },
      { name: 'Delete Client', path: '/api/client/1', method: 'DELETE' },
      { name: 'User Profile', path: '/api/user-profile', method: 'GET' },
      { name: 'Get User Info', path: '/api/user/info/1', method: 'GET' },
      { name: 'Delete User', path: '/api/user/1', method: 'DELETE' },
      { name: 'Chat Users', path: '/api/chat/users', method: 'GET' },
      { name: 'Contact Notes', path: '/api/notes/contact', method: 'GET' },
      { name: 'Create Contact Note', path: '/api/note/contact', method: 'POST' },
      { name: 'Companies Contacts', path: '/api/companies-contact', method: 'GET' },
      { name: 'Email Templates', path: '/api/admin/email-templates', method: 'GET' },
    ]
  },
  'PRODUCTS & CATALOG': {
    critical: [
      { name: 'Get Standard Products', path: '/api/standard-products', method: 'GET' },
      { name: 'Get Custom Products', path: '/api/custom-products', method: 'GET' },
      { name: 'Get Store Products', path: '/api/store-products', method: 'GET' },
      { name: 'Get Categories', path: '/api/categories', method: 'GET' },
    ],
    all: [
      { name: 'Get Standard Products', path: '/api/standard-products', method: 'GET' },
      { name: 'Create Standard Product', path: '/api/standard-product', method: 'POST' },
      { name: 'Get Standard Product', path: '/api/standard-product/1', method: 'GET' },
      { name: 'Update Standard Product', path: '/api/standard-product/1', method: 'POST' },
      { name: 'Delete Standard Product', path: '/api/standard-product/1', method: 'DELETE' },
      { name: 'Get Custom Products', path: '/api/custom-products', method: 'GET' },
      { name: 'Create Custom Product', path: '/api/custom-product', method: 'POST' },
      { name: 'Get Custom Product', path: '/api/custom-product/1', method: 'GET' },
      { name: 'Update Custom Product', path: '/api/custom-product/1', method: 'POST' },
      { name: 'Delete Custom Product', path: '/api/custom-product/1', method: 'DELETE' },
      { name: 'Get Store Products', path: '/api/store-products', method: 'GET' },
      { name: 'Create Store Product', path: '/api/store-product', method: 'POST' },
      { name: 'Get Store Product', path: '/api/store-product/1', method: 'GET' },
      { name: 'Update Store Product', path: '/api/store-product/1', method: 'POST' },
      { name: 'Delete Store Product', path: '/api/store-product/1', method: 'DELETE' },
      { name: 'Get Colors', path: '/api/colors', method: 'GET' },
      { name: 'Create Color', path: '/api/color', method: 'POST' },
      { name: 'Get Categories', path: '/api/categories', method: 'GET' },
      { name: 'Create Category', path: '/api/category', method: 'POST' },
      { name: 'Get Product Images', path: '/api/product/images/1', method: 'GET' },
      { name: 'Get Materials Categories', path: '/api/materials-categories', method: 'GET' },
      { name: 'Get Material', path: '/api/material/1', method: 'GET' },
      { name: 'Production Calendar', path: '/api/production-calendar', method: 'GET' },
    ]
  },
  'INVENTORY & MATERIALS': {
    critical: [
      { name: 'Get Fix Inventory', path: '/api/fix-inventory', method: 'GET' },
      { name: 'Get Foam Inventory', path: '/api/foam-inventory', method: 'GET' },
      { name: 'Get Dynamic Inventory', path: '/api/dynamic-inventory', method: 'GET' },
    ],
    all: [
      { name: 'Get Fix Inventory', path: '/api/fix-inventory', method: 'GET' },
      { name: 'Create Fix Inventory', path: '/api/fix-inventory', method: 'POST' },
      { name: 'Get Fix Inventory Item', path: '/api/fix-inventory/1', method: 'GET' },
      { name: 'Update Fix Inventory', path: '/api/fix-inventory/1', method: 'POST' },
      { name: 'Delete Fix Inventory', path: '/api/fix-inventory/1', method: 'DELETE' },
      { name: 'Get Foam Inventory', path: '/api/foam-inventory', method: 'GET' },
      { name: 'Create Foam Inventory', path: '/api/foam-inventory', method: 'POST' },
      { name: 'Get Foam Inventory Item', path: '/api/foam-inventory/1', method: 'GET' },
      { name: 'Update Foam Inventory', path: '/api/foam-inventory/1', method: 'POST' },
      { name: 'Delete Foam Inventory', path: '/api/foam-inventory/1', method: 'DELETE' },
      { name: 'Get Dynamic Inventory', path: '/api/dynamic-inventory', method: 'GET' },
      { name: 'Create Dynamic Inventory', path: '/api/dynamic-inventory', method: 'POST' },
      { name: 'Get Dynamic Inventory Item', path: '/api/dynamic-inventory/1', method: 'GET' },
      { name: 'Update Dynamic Inventory', path: '/api/dynamic-inventory/1', method: 'POST' },
      { name: 'Delete Dynamic Inventory', path: '/api/dynamic-inventory/1', method: 'DELETE' },
      { name: 'Get Expenses', path: '/api/expenses', method: 'GET' },
      { name: 'Create Expense', path: '/api/expense', method: 'POST' },
      { name: 'Get Fix Expenses', path: '/api/fix-expenses', method: 'GET' },
      { name: 'Create Fix Expense', path: '/api/fix-expense', method: 'POST' },
      { name: 'Material Warehouse In', path: '/api/material-warehouse-in', method: 'POST' },
      { name: 'Material Warehouse Out', path: '/api/material-warehouse-out', method: 'POST' },
    ]
  },
  'CHAT & NOTIFICATIONS': {
    critical: [
      { name: 'Get Notifications', path: '/api/notifications', method: 'GET' },
      { name: 'Get Chat Groups', path: '/api/chat/groups', method: 'GET' },
      { name: 'Send Message', path: '/api/chat/send-message', method: 'POST' },
    ],
    all: [
      { name: 'Get Notifications', path: '/api/notifications', method: 'GET' },
      { name: 'Create Notification', path: '/api/notifications', method: 'POST' },
      { name: 'Unread Count', path: '/api/notifications/unread-count', method: 'GET' },
      { name: 'Mark All Read', path: '/api/notifications/mark-all-as-read', method: 'POST' },
      { name: 'Mark As Read', path: '/api/notification/mark-as-read', method: 'POST' },
      { name: 'Delete Notification', path: '/api/notifications/1', method: 'DELETE' },
      { name: 'Get Chat Groups', path: '/api/chat/groups', method: 'GET' },
      { name: 'Create Chat Group', path: '/api/chat/groups', method: 'POST' },
      { name: 'Get Chat Group', path: '/api/chat/groups/1', method: 'GET' },
      { name: 'Update Chat Group', path: '/api/chat/groups/1', method: 'PUT' },
      { name: 'Delete Chat Group', path: '/api/chat/groups/1', method: 'DELETE' },
      { name: 'Get Group Members', path: '/api/chat/groups/1/members', method: 'GET' },
      { name: 'Add Group Members', path: '/api/chat/groups/1/members', method: 'POST' },
      { name: 'Remove Member', path: '/api/chat/groups/1/members/1', method: 'DELETE' },
      { name: 'Send Message', path: '/api/chat/send-message', method: 'POST' },
      { name: 'Get Messages', path: '/api/chat/get-messages/1', method: 'GET' },
      { name: 'Edit Message', path: '/api/chat/message/1/edit', method: 'PUT' },
      { name: 'Delete Message', path: '/api/chat/message/1', method: 'DELETE' },
      { name: 'Make Call', path: '/api/calls/make', method: 'POST' },
      { name: 'Get Call Status', path: '/api/calls/status/xxx', method: 'GET' },
      { name: 'Send SMS', path: '/api/sms-call/send-message', method: 'POST' },
      { name: 'Get SMS Numbers', path: '/api/sms-call/numbers', method: 'GET' },
    ]
  },
  'FILES & MEDIA': {
    critical: [
      { name: 'Get Gallery', path: '/api/gallery', method: 'GET' },
      { name: 'Get File Manager', path: '/api/files-manager', method: 'GET' },
      { name: 'Get Profile', path: '/api/profile', method: 'GET' },
    ],
    all: [
      { name: 'Get Gallery', path: '/api/gallery', method: 'GET' },
      { name: 'Create Gallery', path: '/api/gallery', method: 'POST' },
      { name: 'Get Gallery Image', path: '/api/gallery/image/sample', method: 'GET' },
      { name: 'Delete Gallery', path: '/api/gallery/1', method: 'DELETE' },
      { name: 'Create Person Media', path: '/api/person/media', method: 'POST' },
      { name: 'Delete Person Media', path: '/api/person/media/1', method: 'DELETE' },
      { name: 'Get File Manager', path: '/api/files-manager', method: 'GET' },
      { name: 'Create Files', path: '/api/files-manager', method: 'POST' },
      { name: 'Get File', path: '/api/file-manager/1', method: 'GET' },
      { name: 'Delete File', path: '/api/file-manager/1', method: 'DELETE' },
      { name: 'Delete Multiple Files', path: '/api/delete-files', method: 'POST' },
      { name: 'Get Slider Images', path: '/api/slider-images', method: 'GET' },
      { name: 'Create Slider Image', path: '/api/slider-images', method: 'POST' },
      { name: 'Delete Slider Image', path: '/api/slider-images/1', method: 'DELETE' },
      { name: 'Update Profile Image', path: '/api/update-profile-img', method: 'POST' },
      { name: 'Get Profile', path: '/api/profile', method: 'GET' },
      { name: 'Save General File', path: '/api/save-general-file', method: 'POST' },
      { name: 'Get Portfolio', path: '/api/portfolio', method: 'GET' },
      { name: 'Create Portfolio Work', path: '/api/portfolio/work', method: 'POST' },
      { name: 'Delete Portfolio Work', path: '/api/portfolio/work/1', method: 'DELETE' },
    ]
  },
  'CMS & CONTENT': {
    critical: [
      { name: 'Get About Us', path: '/api/about-us', method: 'GET' },
      { name: 'Get Blogs', path: '/api/blogs', method: 'GET' },
      { name: 'Get FAQs', path: '/api/faqs', method: 'GET' },
    ],
    all: [
      { name: 'Get About Us', path: '/api/about-us', method: 'GET' },
      { name: 'Create About Us', path: '/api/about-us', method: 'POST' },
      { name: 'Update About Us', path: '/api/about-us/1', method: 'POST' },
      { name: 'Get Blogs', path: '/api/blogs', method: 'GET' },
      { name: 'Create Blog', path: '/api/blog', method: 'POST' },
      { name: 'Get Blog', path: '/api/blog/1', method: 'GET' },
      { name: 'Update Blog', path: '/api/blog/1', method: 'POST' },
      { name: 'Delete Blog', path: '/api/blog/1', method: 'DELETE' },
      { name: 'Get Blog Image', path: '/api/blog/image/1', method: 'GET' },
      { name: 'Get FAQs', path: '/api/faqs', method: 'GET' },
      { name: 'Create FAQ', path: '/api/faq', method: 'POST' },
      { name: 'Update FAQ', path: '/api/faq/1', method: 'POST' },
      { name: 'Delete FAQ', path: '/api/faq/1', method: 'DELETE' },
      { name: 'Get Legal Terms', path: '/api/legal-terms', method: 'GET' },
      { name: 'Create Legal Term', path: '/api/legal-term', method: 'POST' },
      { name: 'Update Legal Term', path: '/api/legal-term/1', method: 'POST' },
      { name: 'Get Portfolio', path: '/api/portfolio', method: 'GET' },
      { name: 'Get Testimonials', path: '/api/testimonials', method: 'GET' },
      { name: 'Create Testimonial', path: '/api/testimonial', method: 'POST' },
      { name: 'Update Testimonial', path: '/api/testimonial/1', method: 'POST' },
      { name: 'Delete Testimonial', path: '/api/testimonial/1', method: 'DELETE' },
    ]
  },
  'INTEGRATIONS': {
    critical: [
      { name: 'Get Integrations', path: '/api/integrations', method: 'GET' },
      { name: 'QuickBooks Invoices', path: '/api/quickbooks/invoices', method: 'GET' },
      { name: 'Twilio Numbers', path: '/api/twilio/numbers', method: 'GET' },
    ],
    all: [
      { name: 'Get Integrations', path: '/api/integrations', method: 'GET' },
      { name: 'Validate Integrations', path: '/api/validate-integrations', method: 'GET' },
      { name: 'QuickBooks Auth URL', path: '/api/quickbooks/auth-url', method: 'POST' },
      { name: 'QuickBooks Disconnect', path: '/api/quickbooks/disconnect', method: 'DELETE' },
      { name: 'QuickBooks Invoices', path: '/api/quickbooks/invoices', method: 'GET' },
      { name: 'QuickBooks Invoice', path: '/api/quickbooks/invoices/1', method: 'GET' },
      { name: 'QuickBooks Send Invoice', path: '/api/quickbooks/invoices/1/send', method: 'POST' },
      { name: 'QuickBooks Payment', path: '/api/quickbooks/payments/1', method: 'GET' },
      { name: 'Twilio Numbers', path: '/api/twilio/numbers', method: 'GET' },
      { name: 'Twilio Available Numbers', path: '/api/twilio/available-numbers', method: 'GET' },
      { name: 'Twilio New Number', path: '/api/twilio/new-number', method: 'POST' },
      { name: 'Twilio Messages', path: '/api/twilio/messages/twilio-number/123', method: 'GET' },
      { name: 'Twilio Send Message', path: '/api/twilio/send-message', method: 'POST' },
      { name: 'GoHighLevel Companies', path: '/api/integrations/ghl/companies', method: 'GET' },
      { name: 'GoHighLevel Company ID', path: '/api/integrations/ghl/company-id', method: 'GET' },
    ]
  },
  'TASKS & CALENDAR': {
    critical: [
      { name: 'Get Tasks', path: '/api/tasks', method: 'GET' },
      { name: 'Get Check-In', path: '/api/get-check-in', method: 'GET' },
    ],
    all: [
      { name: 'Get Tasks', path: '/api/tasks', method: 'GET' },
      { name: 'Create Task', path: '/api/task', method: 'POST' },
      { name: 'Get Task', path: '/api/task/1', method: 'GET' },
      { name: 'Update Task', path: '/api/task/1', method: 'PUT' },
      { name: 'Delete Task', path: '/api/task/1', method: 'DELETE' },
      { name: 'Complete Task', path: '/api/task/1/complete', method: 'PUT' },
      { name: 'New Check-In/Out', path: '/api/new-check-in-out', method: 'POST' },
      { name: 'Start Check-In', path: '/api/start-check-in', method: 'POST' },
      { name: 'Finish Check-In', path: '/api/finish-check-in', method: 'POST' },
      { name: 'Break Check-In', path: '/api/break-check-in', method: 'POST' },
      { name: 'Restart Check-In', path: '/api/restart-check-in', method: 'POST' },
      { name: 'Get Check-In', path: '/api/get-check-in', method: 'GET' },
      { name: 'Update Check-In/Out', path: '/api/update-check-in-out/1', method: 'POST' },
      { name: 'Delete Check-In/Out', path: '/api/check-in-out/1', method: 'DELETE' },
    ]
  },
  'SYSTEM & SETTINGS': {
    critical: [
      { name: 'Get Dashboard', path: '/api/dashboard', method: 'GET' },
      { name: 'Get Workstations', path: '/api/workstations', method: 'GET' },
      { name: 'Get Roles', path: '/api/roles', method: 'GET' },
    ],
    all: [
      { name: 'Get Dashboard', path: '/api/dashboard', method: 'GET' },
      { name: 'Get Categories', path: '/api/categories', method: 'GET' },
      { name: 'Get Active Categories', path: '/api/categories/active/1/module', method: 'GET' },
      { name: 'Get Companies', path: '/api/companies', method: 'GET' },
      { name: 'Create Company', path: '/api/company', method: 'POST' },
      { name: 'Update Company', path: '/api/company/1', method: 'PUT' },
      { name: 'Company Locations', path: '/api/company-locations', method: 'GET' },
      { name: 'Create Company Location', path: '/api/company-location', method: 'POST' },
      { name: 'Get Workstations', path: '/api/workstations', method: 'GET' },
      { name: 'Create Workstation', path: '/api/workstation', method: 'POST' },
      { name: 'Get Workstation', path: '/api/workstation/1', method: 'GET' },
      { name: 'Update Workstation', path: '/api/workstation/1', method: 'POST' },
      { name: 'Delete Workstation', path: '/api/workstation/1', method: 'DELETE' },
      { name: 'Active Workstations', path: '/api/workstations/active', method: 'GET' },
      { name: 'Get Roles', path: '/api/roles', method: 'GET' },
      { name: 'Create Role', path: '/api/role', method: 'POST' },
      { name: 'Update Role', path: '/api/role/1', method: 'POST' },
      { name: 'Delete Role', path: '/api/role/1', method: 'DELETE' },
      { name: 'Active Roles', path: '/api/roles/active', method: 'GET' },
      { name: 'All Permissions', path: '/api/roles/all-permissions', method: 'GET' },
      { name: 'Sidebar Modules', path: '/api/sidebar-modules', method: 'GET' },
      { name: 'Payment Methods', path: '/api/payment-methods', method: 'GET' },
      { name: 'Get Plans', path: '/api/plans', method: 'GET' },
      { name: 'Logout', path: '/api/logout', method: 'POST' },
    ]
  },
  'WEBHOOKS': {
    critical: [],
    all: [
      { name: 'QuickBooks Payments', path: '/api/webhooks/quickbooks/payments', method: 'POST' },
      { name: 'Twilio Message Received', path: '/api/twilio/get-message-received', method: 'POST' },
      { name: 'GoHighLevel Webhook', path: '/api/ghl/webhook', method: 'POST' },
      { name: 'GoHighLevel Opportunity', path: '/api/ghl/webhook/opportunity', method: 'POST' },
    ]
  }
}

function App() {
  const [endpointStatus, setEndpointStatus] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState('Overview')
  const [expandedCategories, setExpandedCategories] = useState({})
  const [showAllEndpoints, setShowAllEndpoints] = useState(false)
  const [lastDailyCheck, setLastDailyCheck] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [overallStats, setOverallStats] = useState({
    total: 0,
    healthy: 0,
    unhealthy: 0,
    avgResponseTime: 0
  })
  const [endpointHistory, setEndpointHistory] = useState(() => {
    const saved = localStorage.getItem('endpointHistory')
    return saved ? JSON.parse(saved) : {}
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name') // name, status, responseTime, successRate

  const checkEndpoint = async (endpoint) => {
    const startTime = Date.now()
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Accept': 'application/json' }
      })

      const responseTime = Date.now() - startTime

      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime,
        statusCode: response.status,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        statusCode: 0,
        error: error.message,
        lastChecked: new Date().toISOString()
      }
    }
  }

  const getEndpointsToCheck = (fullCheck = false) => {
    const endpoints = []
    for (const category of Object.keys(ENDPOINTS)) {
      const categoryEndpoints = fullCheck ? ENDPOINTS[category].all : ENDPOINTS[category].critical
      categoryEndpoints.forEach(endpoint => {
        endpoints.push({ ...endpoint, category })
      })
    }
    return endpoints
  }

  const updateEndpointHistory = (endpointKey, result) => {
    setEndpointHistory(prev => {
      const history = prev[endpointKey] || { checks: [], successRate: 100 }
      const newChecks = [...history.checks, {
        timestamp: result.lastChecked,
        status: result.status,
        responseTime: result.responseTime,
        statusCode: result.statusCode,
        error: result.error
      }].slice(-20) // Keep last 20 checks

      const successCount = newChecks.filter(c => c.status === 'healthy').length
      const successRate = (successCount / newChecks.length) * 100

      const updated = {
        ...prev,
        [endpointKey]: {
          checks: newChecks,
          successRate: Math.round(successRate),
          lastError: result.error || history.lastError,
          lastHealthy: result.status === 'healthy' ? result.lastChecked : history.lastHealthy
        }
      }

      localStorage.setItem('endpointHistory', JSON.stringify(updated))
      return updated
    })
  }

  const checkAllEndpoints = async (fullCheck = false) => {
    setLoading(true)
    const newStatus = {}
    let totalHealthy = 0
    let totalEndpoints = 0
    let totalResponseTime = 0

    const endpointsToCheck = getEndpointsToCheck(fullCheck)

    for (const endpoint of endpointsToCheck) {
      const key = `${endpoint.category}-${endpoint.path}`
      const status = await checkEndpoint(endpoint)
      newStatus[key] = status

      // Update history
      updateEndpointHistory(key, status)

      totalEndpoints++
      if (status.status === 'healthy') totalHealthy++
      totalResponseTime += status.responseTime
    }

    setEndpointStatus(newStatus)
    setOverallStats({
      total: totalEndpoints,
      healthy: totalHealthy,
      unhealthy: totalEndpoints - totalHealthy,
      avgResponseTime: Math.round(totalResponseTime / totalEndpoints)
    })
    setLoading(false)
    setLastCheck(new Date())

    return newStatus
  }

  const sendEmailNotification = async (failedEndpoints) => {
    try {
      // Crear el contenido del email
      const emailBody = `
        <h2>🚨 US Booths API - Health Check Report</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Failed Endpoints:</strong> ${failedEndpoints.length}</p>

        <h3>Failed Endpoints:</h3>
        <ul>
          ${failedEndpoints.map(ep => `
            <li>
              <strong>${ep.name}</strong> (${ep.method} ${ep.path})<br/>
              Status Code: ${ep.statusCode}<br/>
              Error: ${ep.error || 'Unknown error'}
            </li>
          `).join('')}
        </ul>

        <p>Check the dashboard at <a href="https://health.usbooths.com">health.usbooths.com</a></p>
      `

      // Aquí puedes usar tu endpoint de email o servicio
      // Por ahora, solo log en consola
      console.log('Email would be sent to:', NOTIFICATION_EMAIL)
      console.log('Email body:', emailBody)

      // TODO: Implementar envío real de email
      // await fetch(`${API_BASE_URL}/api/send-notification-email`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: NOTIFICATION_EMAIL,
      //     subject: `⚠️ API Health Alert - ${failedEndpoints.length} Endpoints Down`,
      //     html: emailBody
      //   })
      // })
    } catch (error) {
      console.error('Error sending email notification:', error)
    }
  }

  const performDailyCheck = async () => {
    console.log('🔍 Starting daily full check of all endpoints...')

    // Check de TODOS los endpoints
    const allStatus = await checkAllEndpoints(true)

    // Buscar endpoints fallidos
    const failedEndpoints = []
    Object.keys(allStatus).forEach(key => {
      const status = allStatus[key]
      if (status.status === 'unhealthy') {
        const [category, ...pathParts] = key.split('-')
        const path = pathParts.join('-')

        // Buscar el endpoint completo
        for (const cat of Object.keys(ENDPOINTS)) {
          const found = ENDPOINTS[cat].all.find(ep => ep.path === path)
          if (found) {
            failedEndpoints.push({
              ...found,
              category: cat,
              ...status
            })
            break
          }
        }
      }
    })

    console.log(`✅ Daily check complete. ${failedEndpoints.length} failed endpoints`)

    // Si hay endpoints fallidos, enviar email
    if (failedEndpoints.length > 0) {
      await sendEmailNotification(failedEndpoints)
    }

    setLastDailyCheck(new Date())
  }

  const scheduleDailyCheck = () => {
    const now = new Date()
    const nextCheck = new Date()
    nextCheck.setHours(6, 0, 0, 0) // 6:00 AM

    // Si ya pasaron las 6 AM hoy, programar para mañana
    if (now.getHours() >= 6) {
      nextCheck.setDate(nextCheck.getDate() + 1)
    }

    const timeUntilCheck = nextCheck - now

    console.log(`⏰ Daily check scheduled for ${nextCheck.toLocaleString()}`)

    setTimeout(() => {
      performDailyCheck()
      // Programar siguiente check (cada 24 horas)
      setInterval(performDailyCheck, 24 * 60 * 60 * 1000)
    }, timeUntilCheck)
  }

  useEffect(() => {
    // Check inicial (solo críticos)
    checkAllEndpoints(false)

    // Auto-refresh cada 60 segundos (solo críticos)
    const interval = setInterval(() => {
      checkAllEndpoints(false)
    }, 60000)

    // Programar check diario completo
    scheduleDailyCheck()

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Aplicar tema al body
    document.body.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode(prev => !prev)
  }

  const getStatusColor = (status) => {
    return status === 'healthy' ? '#34c759' : '#ff3b30'
  }

  const getStatusIcon = (status) => {
    return status === 'healthy' ? '✓' : '✗'
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const getTotalEndpoints = () => {
    return Object.keys(ENDPOINTS).reduce((total, cat) => {
      return total + ENDPOINTS[cat].all.length
    }, 0)
  }

  const getCriticalEndpointsCount = () => {
    return Object.keys(ENDPOINTS).reduce((total, cat) => {
      return total + ENDPOINTS[cat].critical.length
    }, 0)
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>US Booths API</h1>
          <p className="version">Health Monitor — v2.0</p>
        </div>

        <div className="sidebar-search">
          <input type="text" placeholder="Search endpoints..." />
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">GENERAL</div>
            <button
              className={`nav-item ${selectedCategory === 'Overview' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Overview')}
            >
              Overview
            </button>
            <button
              className={`nav-item ${selectedCategory === 'All Endpoints' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('All Endpoints')}
            >
              All Endpoints
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#86868b' }}>
                {getTotalEndpoints()}
              </span>
            </button>
          </div>

          {Object.keys(ENDPOINTS).map(category => (
            <div key={category} className="nav-section">
              <div className="nav-label">{category}</div>
              <button
                className={`nav-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#86868b' }}>
                  {expandedCategories[category] ? ENDPOINTS[category].all.length : ENDPOINTS[category].critical.length}
                </span>
              </button>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h2>{selectedCategory}</h2>
          <div className="header-actions">
            <button onClick={toggleTheme} className="theme-btn" title={darkMode ? 'Tema Claro' : 'Tema Oscuro'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => checkAllEndpoints(false)} className="refresh-btn" disabled={loading}>
              {loading ? '🔄 Checking...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{overallStats.total}</div>
            <div className="stat-label">Monitored</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#34c759' }}>{overallStats.healthy}</div>
            <div className="stat-label">Healthy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#ff3b30' }}>{overallStats.unhealthy}</div>
            <div className="stat-label">Unhealthy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{overallStats.avgResponseTime}ms</div>
            <div className="stat-label">Avg Response</div>
          </div>
        </div>

        {/* Overview Section */}
        {selectedCategory === 'Overview' && (
          <>
            <div className="base-url-section">
              <h3>API Configuration</h3>
              <div className="url-info">
                <div><strong>Base URL:</strong> <span className="url">{API_BASE_URL}</span></div>
                <div><strong>Total Endpoints:</strong> {getTotalEndpoints()} endpoints</div>
                <div><strong>Critical Endpoints:</strong> {getCriticalEndpointsCount()} endpoints</div>
                <div><strong>Monitoring:</strong> Critical endpoints only (expandable)</div>
              </div>
            </div>

            <div className="api-stats-section">
              <h3>Monitoring Strategy</h3>
              <ul>
                <li><strong>Real-time:</strong> Monitors {getCriticalEndpointsCount()} critical endpoints every 60 seconds</li>
                <li><strong>Daily Check:</strong> Full scan of all {getTotalEndpoints()} endpoints at 6:00 AM</li>
                <li><strong>Email Alerts:</strong> Automatic notification to {NOTIFICATION_EMAIL} when endpoints fail</li>
                <li><strong>Expandable:</strong> Click "Show All" in any category to see all endpoints</li>
              </ul>
            </div>

            <div className="last-check-section">
              <p><strong>Last Real-time Check:</strong> {lastCheck.toLocaleString()}</p>
              <p><strong>Last Daily Check:</strong> {lastDailyCheck ? lastDailyCheck.toLocaleString() : 'Not yet performed'}</p>
              <p><strong>Next Daily Check:</strong> Tomorrow at 6:00 AM</p>
            </div>
          </>
        )}

        {/* All Endpoints Table View */}
        {selectedCategory === 'All Endpoints' && (
          <div className="all-endpoints-section">
            <div className="table-controls">
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="table-search"
              />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="table-sort">
                <option value="name">Sort by Name</option>
                <option value="status">Sort by Status</option>
                <option value="responseTime">Sort by Response Time</option>
                <option value="successRate">Sort by Success Rate</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>

            <div className="endpoints-table-container">
              <table className="endpoints-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Category</th>
                    <th>Response Time</th>
                    <th>Success Rate</th>
                    <th>Last Check</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let allEndpoints = []
                    Object.keys(ENDPOINTS).forEach(category => {
                      ENDPOINTS[category].all.forEach(endpoint => {
                        const key = `${category}-${endpoint.path}`
                        const status = endpointStatus[key]
                        const history = endpointHistory[key]

                        allEndpoints.push({
                          key,
                          name: endpoint.name,
                          path: endpoint.path,
                          method: endpoint.method,
                          category,
                          status: status?.status || 'unknown',
                          responseTime: status?.responseTime || 0,
                          successRate: history?.successRate || 0,
                          lastChecked: status?.lastChecked,
                          error: status?.error
                        })
                      })
                    })

                    // Filter
                    if (searchTerm) {
                      allEndpoints = allEndpoints.filter(ep =>
                        ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ep.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ep.category.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                    }

                    // Sort
                    allEndpoints.sort((a, b) => {
                      switch (sortBy) {
                        case 'name':
                          return a.name.localeCompare(b.name)
                        case 'status':
                          return a.status === 'healthy' ? -1 : 1
                        case 'responseTime':
                          return b.responseTime - a.responseTime
                        case 'successRate':
                          return b.successRate - a.successRate
                        case 'category':
                          return a.category.localeCompare(b.category)
                        default:
                          return 0
                      }
                    })

                    return allEndpoints.map(endpoint => (
                      <tr key={endpoint.key} className={endpoint.status === 'unhealthy' ? 'unhealthy-row' : ''}>
                        <td>
                          <span className={`status-badge ${endpoint.status}`}>
                            {endpoint.status === 'healthy' ? '✓' : endpoint.status === 'unhealthy' ? '✗' : '−'}
                          </span>
                        </td>
                        <td>
                          <div className="endpoint-cell">
                            <strong>{endpoint.name}</strong>
                            <span className="endpoint-path-small">{endpoint.path}</span>
                            {endpoint.error && (
                              <span className="error-badge" title={endpoint.error}>
                                {endpoint.error}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`method-badge ${endpoint.method.toLowerCase()}`}>
                            {endpoint.method}
                          </span>
                        </td>
                        <td>{endpoint.category}</td>
                        <td>
                          <span className={endpoint.responseTime > 1000 ? 'slow' : endpoint.responseTime > 500 ? 'medium' : 'fast'}>
                            {endpoint.responseTime}ms
                          </span>
                        </td>
                        <td>
                          <div className="success-rate">
                            <span className={endpoint.successRate >= 90 ? 'high' : endpoint.successRate >= 70 ? 'medium' : 'low'}>
                              {endpoint.successRate}%
                            </span>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${endpoint.successRate}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="last-check">
                          {endpoint.lastChecked ? new Date(endpoint.lastChecked).toLocaleTimeString() : '−'}
                        </td>
                      </tr>
                    ))
                  })()}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <p>Showing {(() => {
                let count = 0
                Object.keys(ENDPOINTS).forEach(cat => {
                  count += ENDPOINTS[cat].all.length
                })
                return searchTerm ?
                  `${allEndpoints.filter(ep =>
                    ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ep.path.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length} of ${count}` : count
              })()} endpoints</p>
            </div>
          </div>
        )}

        {/* Endpoints List */}
        {selectedCategory !== 'Overview' && selectedCategory !== 'All Endpoints' && ENDPOINTS[selectedCategory] && (
          <div className="endpoints-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Endpoints</h3>
              <button
                onClick={() => toggleCategory(selectedCategory)}
                style={{
                  background: 'transparent',
                  border: '1px solid #d2d2d7',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: '#007aff'
                }}
              >
                {expandedCategories[selectedCategory] ? '← Show Critical Only' : '→ Show All Endpoints'}
              </button>
            </div>

            <div className="endpoints-list">
              {(expandedCategories[selectedCategory] ? ENDPOINTS[selectedCategory].all : ENDPOINTS[selectedCategory].critical).map((endpoint) => {
                const key = `${selectedCategory}-${endpoint.path}`
                const status = endpointStatus[key]

                return (
                  <div key={key} className="endpoint-card">
                    <div className="endpoint-header">
                      <div className="endpoint-method">{endpoint.method}</div>
                      <div className="endpoint-name">{endpoint.name}</div>
                      {status && (
                        <div
                          className={`endpoint-status ${status.status}`}
                          style={{ color: getStatusColor(status.status) }}
                        >
                          {getStatusIcon(status.status)} {status.status}
                        </div>
                      )}
                    </div>
                    <div className="endpoint-path">{endpoint.path}</div>
                    {status && (
                      <div className="endpoint-metrics">
                        <span>Response: {status.responseTime}ms</span>
                        <span>Status Code: {status.statusCode || 'N/A'}</span>
                        <span className="endpoint-time">
                          Last checked: {new Date(status.lastChecked).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    {status?.error && (
                      <div className="endpoint-error">
                        Error: {status.error}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
