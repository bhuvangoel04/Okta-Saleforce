# Federated Login: Node.js + Okta + Salesforce (SAML)

This project demonstrates how to integrate a Node.js + Express app with **Okta as an identity broker** and **Salesforce as a SAML Identity Provider (IdP)**.

## 🔁 Authentication Flow

User → Node.js App (OIDC) → Okta (Broker) → Salesforce (SAML IdP)

## 🧱 Architecture

| Component     | Role                          |
|---------------|-------------------------------|
| Salesforce    | Identity Provider (SAML)      |
| Okta          | Identity Broker (OIDC + SAML) |
| Node.js App   | OIDC Client (SP)              |

---

## 🚀 Setup Instructions

### 1. Configure Salesforce as a SAML IdP

1. Log in to Salesforce.
2. Go to **Setup → Identity Provider**.
3. If not already enabled, click **Enable Identity Provider**.
4. Download or generate an **X.509 certificate**.
5. Note:
   - **Issuer (Entity ID)**
   - **SSO URL**
   - **Certificate**

---

### 2. Configure Okta as a Federation Broker

#### A. Add Salesforce as a SAML Identity Provider

1. Log in to Okta Admin Console.
2. Navigate to **Identity Providers → Add Identity Provider** → Select **SAML 2.0**.
3. Fill in:
   - **Name**: Salesforce
   - **IdP Single Sign-On URL**: (from Salesforce)
   - **IdP Issuer**: (from Salesforce)
   - **Signature Certificate**: (Salesforce X.509 certificate)
4. Set Attribute Statements (e.g.):
   - `Email` → `user.email`

#### B. Add Routing Rule

1. Go to **Identity Providers → Routing Rules**.
2. Create a rule:
   - If `user.email` ends with your domain (e.g. `@yourcompany.com`)
   - Route to **Salesforce IdP**

---

### 3. Configure Okta OIDC Application for Node.js

1. Go to **Applications → Create App Integration**.
2. Choose:
   - **Sign-in method**: OIDC - OpenID Connect
   - **Application type**: Web
3. Enter:
   - **Redirect URI**: `http://localhost:3000/callback`
   - **Logout Redirect URI**: `http://localhost:3000/logout`
4. Save and copy:
   - **Client ID**
   - **Client Secret**
   - **Issuer URL** (e.g., `https://your-okta-domain/oauth2/default`)

---

### 4. Setup Node.js App

#### A. Install Dependencies

```bash
npm install express express-session @okta/oidc-middleware
