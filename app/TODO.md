[ ] Start working on SSR / static generation

[ ] Add video links from youtube and/or Tiktok for stories - https://news.ycombinator.com/item?id=38463233
[ ] load fonts correctly

[X] skip loading icon on bundled
[X] add data to the deploy
[X] Fix service worker loader
[X] Make a system to add / load / use images and static files
[x] integrate deploy with github
[x] move integrations (chrome extension) to extensions (loading chrome extensions only in a chrome extension environment)
[X] Fix integrations and place lists
[X] Work on listing the places, events, etc in the app


# meetup.rio App Implementation Tasks

## **Story System**
- [ ] Design and implement "Story" feature for admin-generated stories.
- [ ] Implement expiration logic for stories (e.g., stories disappear after 24 hours).
- [ ] Allow admins to upload images, videos, and text updates.
- [ ] Design and implement story carousel for users to view real-time updates.
- [ ] Add user interaction (e.g., likes, comments, reactions) for stories.
- [ ] Notify users when a new story is posted.
- [ ] Link stories to relevant events, places, or activities for quick access.

## Event Management
- [ ] Image gallery
- [ ] Organizer information
- [ ] Related content display
- [ ] Implement date filtering for events
- [ ] Add functionality to handle recurring events (e.g., Weekly Beach Cleanup)

## Place Management
- [ ] Image gallery
- [ ] Rating display
- [ ] Related content and events

## Activity Management
- [ ] Maximum participants and languages
- [ ] Image gallery
- [ ] Rating display

## Review System
- [ ] Implement review display for events, places, activities, and itineraries
- [ ] Allow users to view public reviews

## Itinerary Feature
- [ ] Implement "Itineraries" functionality
- [ ] Allow users to view public itineraries
- [ ] Display itinerary details including duration and items

## Map and Location Features
- [ ] Implement pins and user location in a map component
- [ ] Implement interactive map display of Rio de Janeiro
- [ ] Add pins/markers for event and place locations
- [ ] To add Places, integrate with Google Maps - the user post a link and we extract the data
- [ ] Develop search functionality for places, events, and activities
- [ ] Create "Nearby" feature with distance filters (1km, 3km, 5km, 10km)

## Content Management
- [ ] Implement content display for categories, events, places, and activities
- [ ] Create a system to show related content on detail pages

## User Interaction
- [ ] Develop an interaction counter for events, places, and activities

## WhatsApp Integration
- [ ] Implement system to generate authentication links for WhatsApp
- [ ] Create workflow for users to edit content via WhatsApp messages
- [ ] Develop system to handle user profile management via WhatsApp
- [ ] Use a boty to create groups automatically for events, activities, etc
## Navigation and UI
- [ ] Design and implement bottom navigation bar with:
  - [ ] Itineraries
- [ ] Implement top navigation bar with:
  - [ ] Notifications

## Deployment and Data Management
- [ ] Create CSS deploy in one file
- [ ] Create JS deploy in one file
- [ ] Generate JSON files for each entry type (events, places, activities, etc.)
- [ ] Create JSON files for full lists of entries
- [ ] Generate JSON files for map pins/markers
- [ ] Implement system to download JSON files on user navigation
- [ ] Develop mechanism to add downloaded JSON data to local backend/database
- [ ] Create deploy script to generate all necessary JSON files
- [ ] Implement caching strategy for downloaded JSON files
- [ ] Create system to check for and download updates to JSON files
- [ ] Develop error handling for failed JSON downloads
- [ ] Implement fallback mechanism for offline use with cached data
- [ ] Create documentation for deployment and data management processes

---

# Completed Tasks

## Event Management
- [X] Design and implement "Events" list view
- [X] Create event detail pages with:
  - [X] Title, description, date, location, and price information

## Place Management
- [X] Implement "Places" list view
- [X] Create place detail pages with:
  - [X] Name, description, category, and address
  - [X] Opening hours

## Activity Management
- [X] Develop "Activities" section
- [X] Create activity detail pages with:
  - [X] Title, description, duration, and cost
  - [X] Provider information

## Review System
- [X] Like System: implement private reviews to work as bookmark/like system

## Map and Location Features
- [X] Implement location permission request
- [X] Implement pins

## User Interaction
- [X] Implement "Like" functionality for events
- [X] Create a favorite system for users

## Navigation and UI
- [X] Design and implement bottom navigation bar with:
  - [X] Home
  - [X] Events
  - [X] Places
  - [X] Activities
- [X] Implement top navigation bar with:
  - [X] Back button
  - [X] Page title
  - [X] Dark/Light mode toggle