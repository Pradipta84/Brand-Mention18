# Postman Guide: Adding Queries to Inbox

## Endpoint Details

**URL:** `http://192.168.195.1:3000/api/queries/ingest`  
**Method:** `POST`  
**Headers:**
```
Content-Type: application/json
```

## Sample JSON Payloads for Different Query Types

## Priority Level Examples (High, Medium, Low)

### HIGH Priority Examples

#### Example 1A: High Priority - Technical Issue (Email)
```json
{
  "channel": "email",
  "authorName": "John Martinez",
  "authorEmail": "john.m@company.com",
  "subject": "URGENT: API Integration Broken",
  "body": "Our production API integration stopped working this morning. We're unable to sync data and this is blocking our entire workflow. Need immediate assistance to restore service.",
  "priority": "high",
  "tags": ["technical", "bug_report"]
}
```

#### Example 1B: High Priority - Billing Dispute (Email)
```json
{
  "channel": "email",
  "authorName": "Maria Garcia",
  "authorEmail": "maria.g@business.com",
  "subject": "Incorrect Billing - Need Resolution",
  "body": "I was charged $299 this month but my plan should only be $99. This is a significant error and I need this resolved immediately. Please investigate and issue a refund.",
  "priority": "high",
  "tags": ["billing", "complaint"]
}
```

#### Example 1C: High Priority - Service Outage (Support Ticket)
```json
{
  "channel": "support_ticket",
  "authorName": "David Chen",
  "authorEmail": "david.c@enterprise.com",
  "subject": "Dashboard Not Accessible - Production Impact",
  "body": "Our entire team cannot access the dashboard. We're getting 500 errors on all pages. This is affecting our daily operations. Please escalate and fix immediately.",
  "priority": "high",
  "tags": ["bug_report", "technical"]
}
```

#### Example 1D: High Priority - Account Security Issue (Email)
```json
{
  "channel": "email",
  "authorName": "Jennifer Taylor",
  "authorEmail": "jennifer.t@corp.com",
  "subject": "URGENT: Unauthorized Access Detected",
  "body": "I received an email notification about a login from an unknown location. I did not authorize this access. My account may be compromised. Please lock my account immediately and investigate. This is a critical security issue.",
  "priority": "high",
  "tags": ["technical", "complaint"]
}
```

#### Example 1E: High Priority - Data Loss Issue (Support Ticket)
```json
{
  "channel": "support_ticket",
  "authorName": "Robert Kim",
  "authorEmail": "robert.k@company.com",
  "subject": "CRITICAL: Data Missing After System Update",
  "body": "After the recent system update, all our historical reports and data from the last 6 months have disappeared. This is critical business data that we need for our quarterly review. We need immediate assistance to recover this data. Our deadline is tomorrow.",
  "priority": "high",
  "tags": ["bug_report", "technical", "complaint"]
}
```

#### Example 1F: High Priority - Payment Processing Failure (Email)
```json
{
  "channel": "email",
  "authorName": "Amanda White",
  "authorEmail": "amanda.w@business.com",
  "subject": "Payment Processing Failed - Customer Impact",
  "body": "Our payment processing integration has been failing for the past 2 hours. Customers cannot complete purchases and we're losing revenue. This is affecting our live production environment. Need immediate technical support to restore payment functionality.",
  "priority": "high",
  "tags": ["technical", "bug_report", "billing"]
}
```

### MEDIUM Priority Examples

#### Example 2A: Medium Priority - Feature Question (Email)
```json
{
  "channel": "email",
  "authorName": "Sarah Williams",
  "authorEmail": "sarah.w@startup.io",
  "subject": "Question about Export Feature",
  "body": "I'm trying to export my reports but I'm not sure which format would work best for our analytics team. Can you provide guidance on the available export formats and their use cases?",
  "priority": "medium",
  "tags": ["question", "technical"]
}
```

#### Example 2B: 
```json
{
  "channel": "email",
  "authorName": "Michael Brown",
  "authorEmail": "michael.b@company.com",
  "subject": "Request to Upgrade to Enterprise Plan",
  "body": "We're interested in upgrading from the Pro plan to Enterprise. Could you send me information about pricing, features, and the migration process? We'd like to make the switch within the next month.",
  "priority": "medium",
  "tags": ["request", "billing"]
}
```

#### Example 2C: Medium Priority - General Inquiry (Twitter)
```json
{
  "channel": "twitter",
  "authorName": "TechUser123",
  "authorHandle": "@techuser123",
  "body": "Hey @BrandWatch, I'm considering your platform for our team. Can you tell me about the integration options available? Looking for something that works with Slack and Jira.",
  "priority": "medium",
  "tags": ["question", "technical"]
}
```

### LOW Priority Examples

#### Example 3A: Low Priority - Feature Suggestion (Forum)
```json
{
  "channel": "forum",
  "authorName": "CommunityHelper",
  "authorHandle": "helper_user789",
  "body": "Just a suggestion - it would be nice to have a dark mode option in the dashboard. Not urgent at all, just something to consider for future updates. Thanks for the great product!",
  "priority": "low",
  "tags": ["feature_request", "feedback"]
}
```

#### Example 3B: Low Priority - General Question (Email)
```json
{
  "channel": "email",
  "authorName": "Lisa Anderson",
  "authorEmail": "lisa.a@smallbiz.com",
  "subject": "Question about Documentation",
  "body": "I was browsing your documentation and noticed there's a section on API rate limits. Could you clarify if these limits apply per user or per organization? No rush on this, just curious for future planning.",
  "priority": "low",
  "tags": ["question", "technical"]
}
```

#### Example 3C: Low Priority - Positive Feedback (Twitter)
```json
{
  "channel": "twitter",
  "authorName": "HappyCustomer",
  "authorHandle": "@happy_customer",
  "body": "Just wanted to share that we've been using @BrandWatch for 6 months now and it's been great! The team loves it. Keep up the good work! 🎉",
  "priority": "low",
  "tags": ["feedback"]
}
```

---

## Additional Query Examples

### Example 1: Urgent Email Query (Billing Issue)
```json
{
  "channel": "email",
  "authorName": "Sarah Johnson",
  "authorEmail": "sarah.j@example.com",
  "subject": "Billing Issue - Incorrect Charge",
  "body": "Hi, I noticed an incorrect charge on my account this month. I was charged $99 but should have been charged $49. Can you please look into this and issue a refund? This is urgent as it's affecting my budget.",
  "priority": "urgent",
  "tags": ["billing", "complaint"]
}
```

### Example 2: Twitter Question (Technical)
```json
{
  "channel": "twitter",
  "authorName": "TechEnthusiast",
  "authorHandle": "@techfan123",
  "body": "Hey @BrandWatch, how do I integrate your API with my React app? Looking for documentation or examples. Thanks!",
  "tags": ["question", "technical"]
}
```

### Example 3: Feature Request (Support Ticket)
```json
{
  "channel": "support_ticket",
  "authorName": "Mike Chen",
  "authorEmail": "mike.chen@company.com",
  "subject": "Feature Request: Dark Mode",
  "body": "I would love to see a dark mode option in the dashboard. Many of us work late hours and the bright interface is hard on the eyes. Could you consider adding this feature?",
  "tags": ["feature_request", "request"]
}
```

### Example 4: Bug Report (Reddit)
```json
{
  "channel": "reddit",
  "authorName": "u/developer_pro",
  "authorHandle": "u/developer_pro",
  "body": "Is anyone else experiencing crashes when trying to export reports? The app keeps freezing when I click export. This is really frustrating and I need to get this report to my manager ASAP.",
  "priority": "high",
  "tags": ["bug_report", "complaint"]
}
```

### Example 5: General Question (Email)
```json
{
  "channel": "email",
  "authorName": "Emily Rodriguez",
  "authorEmail": "emily.r@startup.io",
  "subject": "Question about Pricing Plans",
  "body": "I'm interested in upgrading to the Pro plan. Can you tell me what features are included and if there's a discount for annual billing?",
  "tags": ["question", "billing"]
}
```

### Example 6: Technical Issue (Chat)
```json
{
  "channel": "chat",
  "authorName": "Alex Thompson",
  "authorEmail": "alex.t@example.com",
  "body": "The login page isn't working. I keep getting an error message saying 'Invalid credentials' even though I'm using the correct password. This started happening yesterday.",
  "priority": "high",
  "tags": ["bug_report", "technical"]
}
```

### Example 7: Positive Feedback (Forum)
```json
{
  "channel": "forum",
  "authorName": "Community Member",
  "authorHandle": "cm_user456",
  "body": "Great product! I've been using it for 3 months now and it's really helped streamline our workflow. Just wanted to share some positive feedback.",
  "tags": ["feedback"]
}
```

### Example 8: High Priority Technical Support (Email)
```json
{
  "channel": "email",
  "authorName": "David Kim",
  "authorEmail": "david.kim@corp.com",
  "subject": "Technical Support Needed",
  "body": "We're having issues with the API rate limits. Our application is hitting the limits frequently and we need to increase our quota. Can someone from technical support contact us?",
  "priority": "high",
  "tags": ["technical", "request"]
}
```

### Example 9: Positive Social Media Mention (Twitter)
```json
{
  "channel": "twitter",
  "authorName": "HappyCustomer",
  "authorHandle": "@happy_customer",
  "body": "Just wanted to say thanks to @BrandWatch team for the amazing support! You guys are the best! 🙌",
  "tags": ["feedback"]
}
```

### Example 10: Critical Bug Report (Support Ticket)
```json
{
  "channel": "support_ticket",
  "authorName": "Lisa Wang",
  "authorEmail": "lisa.wang@business.com",
  "subject": "Bug Report: Dashboard Not Loading",
  "body": "The dashboard is not loading properly. I see a blank screen with just the sidebar. This happens in both Chrome and Firefox. I've tried clearing cache and cookies but the issue persists. Please help!",
  "priority": "high",
  "tags": ["bug_report", "technical"]
}
```

## Required Fields

- `channel` (string) - One of: `email`, `twitter`, `reddit`, `chat`, `forum`, `support_ticket`, `other`
- `authorName` (string) - Name of the person sending the query
- `body` (string) - The query message/content

## Optional Fields

- `authorEmail` (string) - Email address (required for email channel)
- `authorHandle` (string) - Social media handle (e.g., @username, u/username)
- `subject` (string) - Subject line (for email/support tickets)
- `sourceId` (string) - External ID from source system
- `sourceUrl` (string) - URL to the original query
- `receivedAt` (string) - ISO 8601 date format (defaults to now)
- `priority` (string) - One of: `low`, `medium`, `high`, `urgent` (auto-detected if not provided)
- `tags` (array of strings) - One or more of: `question`, `request`, `complaint`, `feedback`, `bug_report`, `feature_request`, `billing`, `technical`, `general` (auto-detected if not provided)

## Priority Auto-Detection

The system automatically detects priority based on keywords:
- **URGENT**: "urgent", "asap", "immediately", "critical", "emergency"
- **HIGH**: "important", "need help", "not working", "broken", "issue"
- **MEDIUM**: Default priority
- **LOW**: "when you can", "no rush", "just wondering"

## Tag Auto-Detection

The system automatically detects tags based on content:
- **QUESTION**: Contains "?", "how", "what", "when", "where", "why"
- **REQUEST**: Contains "please", "request", "need", "want", "would like"
- **COMPLAINT**: Contains "problem", "issue", "wrong", "bad", "terrible"
- **FEEDBACK**: Contains "feedback", "suggestion", "opinion"
- **BUG_REPORT**: Contains "bug", "error", "crash", "broken", "not working"
- **FEATURE_REQUEST**: Contains "feature", "add", "implement", "would like"
- **BILLING**: Contains "billing", "charge", "payment", "invoice", "price"
- **TECHNICAL**: Contains "api", "integration", "technical", "code", "developer"

## Response

**Success Response (200):**
```json
{
  "success": true,
  "queryId": "clx1234567890"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message here"
}
```

## Quick Test in Postman

1. Open Postman
2. Create a new POST request
3. URL: `http://192.168.195.1:3000/api/queries/ingest`
4. Headers: Add `Content-Type: application/json`
5. Body: Select "raw" and "JSON", paste one of the examples above
6. Click "Send"
7. Check the inbox at `http://192.168.195.1:3000/inbox` to see the new query

## View Queries

After ingesting, you can view queries:

**Get all queries:**
```
GET http://192.168.195.1:3000/api/queries?limit=10
```

**Get queries by status:**
```
GET http://192.168.195.1:3000/api/queries?status=NEW
```

**Get urgent queries:**
```
GET http://192.168.195.1:3000/api/queries?priority=URGENT
```

**Get queries by channel:**
```
GET http://192.168.195.1:3000/api/queries?channel=email
```

## Resolved Query Examples

### Example 11: Create a Query That's Already Resolved
```json
{
  "channel": "email",
  "authorName": "Robert Smith",
  "authorEmail": "robert.s@example.com",
  "subject": "Account Access Issue - RESOLVED",
  "body": "I was having trouble accessing my account yesterday, but I've managed to reset my password and everything is working now. Thanks for the quick response!",
  "priority": "medium",
  "status": "resolved",
  "tags": ["technical", "feedback"],
  "receivedAt": "2024-11-14T10:00:00Z"
}
```

**Note:** By adding `"status": "resolved"`, the query will appear in the "RESOLVED" section immediately!

### Example 12: Resolved Support Ticket
```json
{
  "channel": "support_ticket",
  "authorName": "Jennifer Lee",
  "authorEmail": "jennifer.lee@company.com",
  "subject": "Feature Question - Answered",
  "body": "I asked about the export feature last week and received a helpful response. The documentation you provided was exactly what I needed. Issue is now resolved!",
  "status": "resolved",
  "tags": ["question", "feedback"]
}
```

## Updating Query Status to Resolved

To mark an existing query as **RESOLVED**, use the status update endpoint:

**Endpoint:** `POST http://192.168.195.1:3000/api/queries/[QUERY_ID]/status`

**Replace `[QUERY_ID]` with the actual query ID from the response when you created the query.**

**Request Body:**
```json
{
  "status": "resolved",
  "notes": "Issue resolved. Customer confirmed the solution worked."
}
```

**Example:**
```bash
# First, create a query and note the queryId from the response
POST http://192.168.195.1:3000/api/queries/ingest
# Response: { "success": true, "queryId": "clx1234567890" }

# Then update it to resolved
POST http://192.168.195.1:3000/api/queries/clx1234567890/status
Content-Type: application/json

{
  "status": "resolved",
  "notes": "Customer confirmed the billing issue has been fixed and refund processed."
}
```

**Available Status Values:**
- `new` - New query (default)
- `assigned` - Assigned to a team member
- `in_progress` - Currently being worked on
- `waiting_customer` - Waiting for customer response
- `resolved` - Issue resolved
- `closed` - Query closed

## Complete Workflow: Create and Resolve a Query

**Step 1: Create a new query**
```json
POST http://192.168.195.1:3000/api/queries/ingest
{
  "channel": "email",
  "authorName": "Customer Name",
  "authorEmail": "customer@example.com",
  "subject": "Help with Integration",
  "body": "I need help integrating your API with my application."
}
```

**Response:**
```json
{
  "success": true,
  "queryId": "clx1234567890"
}
```

**Step 2: Update status to IN_PROGRESS**
```json
POST http://192.168.195.1:3000/api/queries/clx1234567890/status
{
  "status": "in_progress",
  "notes": "Assigned to technical support team"
}
```

**Step 3: Update status to RESOLVED**
```json
POST http://192.168.195.1:3000/api/queries/clx1234567890/status
{
  "status": "resolved",
  "notes": "Provided API documentation and integration guide. Customer confirmed it worked."
}
```

## Deleting Queries

### Delete a Query via API

You can delete a query using the DELETE endpoint:

**Endpoint:**
```
DELETE http://192.168.195.1:3000/api/queries/{queryId}
```

**Example:**
```
DELETE http://192.168.195.1:3000/api/queries/clx1234567890
```

**Response:**
```json
{
  "success": true,
  "message": "Query deleted successfully"
}
```

**Note:** Deleting a query will also delete all related records (tags, assignments, history) due to cascade deletion.

### Delete a Query via UI

1. Go to the inbox page: `http://192.168.195.1:3000/inbox`
2. Click on a query card to open the detail modal
3. Scroll to the bottom of the modal
4. Click the "Delete Query" button (red button with trash icon)
5. Confirm the deletion in the popup dialog
6. The page will automatically refresh after deletion

## Troubleshooting

### Resolved Count Not Updating

If you've added a resolved query but the count still shows "0":

1. **Refresh the page**: The inbox page uses server-side rendering, so you need to refresh to see updated counts
2. **Check the query status**: Verify the query was created with `status: "resolved"` (not `"RESOLVED"` - use lowercase)
3. **Check the API response**: Make sure the API returned `success: true` when you created the query
4. **Verify in database**: You can check Prisma Studio at `http://localhost:5556/` to see if the query exists with the correct status

### Common Issues

- **Status not updating**: Make sure you're using lowercase status values (`"resolved"`, not `"RESOLVED"`)
- **Query not appearing**: Check that the API request was successful (status 200)
- **Delete not working**: Make sure you're using the correct query ID

## Tips

- **Priority**: If you don't specify priority, the system will auto-detect it based on keywords
- **Tags**: If you don't specify tags, the system will auto-detect them based on content
- **Channel**: Make sure to use the correct channel name (lowercase)
- **Auto-tagging**: The system automatically tags queries, so you can omit the `tags` field
- **Auto-priority**: The system automatically detects priority, so you can omit the `priority` field
- **Resolved Status**: When you mark a query as resolved, the system automatically sets `resolvedAt` timestamp
- **History**: All status changes are tracked in the query history
- **Page Refresh**: After adding, updating, or deleting queries, refresh the page to see the updated counts and list

