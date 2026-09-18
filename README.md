# PTL App

A mobile product prototype for **LetsTransport's PTL (Part Truck Load) network** — the partner-facing app used at pickup points to log in, view assigned pickups, scan packages into a docket, and manage trips.

Built and iterated by me as a Product Manager, using React + AI-assisted prototyping, rendered in a phone-shell for realistic on-device review with stakeholders. Talks to the same data model as the companion [PTL Shipping Console](https://github.com/yugalagrawal/ptl-shipping-console) prototype.

> This is a **prototype**, not the production app. All data (partners, pickups, sessions) is mocked for demonstration.

## Flows

- **Partner login** and role-based home screen
- **Pickup list & detail** — assigned pickups for the day
- **Scan-to-docket** — scan packages against a pickup and review the generated docket
- **Trips & pickup history**
- **Profile**

## Stack

React 19 · Vite · Tailwind CSS · React Router

## Running locally

```bash
npm install
npm run dev
```
