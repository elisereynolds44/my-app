# Invest-ish  
A personal finance learning app for college students

Invest-ish is an educational mobile app designed to help college students build clean, confident mental models around investing through familiar brands, structured learning modules, and guided onboarding.

Instead of overwhelming users with financial jargon, Invest-ish begins with companies students already know and gradually introduces investing concepts in an approachable, interactive way.

---

## Alpha milestone

The Alpha release focuses on validating the core experience flow, onboarding clarity, and learning navigation.

### Onboarding experience
- Animated splash screen with typewriter branding 
- Welcome screen with progressive typewriter introduction
- Brand familiarity carousel (Apple, Nike, Spotify, etc.)
- Delayed call-to-action reveal for smoother onboarding pacing
- Skip onboarding capability

### Home experience
- Brand exploration prompt (“What would you invest in?”)
- Rotating brand bubble animation
- Primary navigation to onboarding and roadmap
- Early product tone and learning positioning

### Learning roadmap
- Structured module progression system
- Locked vs unlocked module states
- Visual learning path to reinforce progress
- Module entry routing architecture

### Profile creation (onboarding step)
- Basic user setup screen
- Establishes personalization foundation
- Positioned after onboarding for narrative continuity

### Navigation architecture
- Expo Router file-based navigation
- Tab bar with Home, Roadmap, Profile
- Hidden onboarding routes
- Stack and tab composition pattern
- Debug routing overlay for development

### Competition tab (placeholder)
- Future feature scaffolding
- Intended for school-based challenges, leaderboards, and engagement mechanics

---

## Alpha key results

The Alpha milestone is considered successful when the following outcomes are achieved:

- Users can create an account and log in successfully in 10 out of 10 structured authentication test attempts.
- User progress persists after logout and login in at least 3 separate test sessions for each of 3 test users.
- One complete lesson renders correctly end-to-end with no text truncation, layout overlap, or visual formatting errors across at least 2 device sizes (phone simulator and physical device).
- Users can navigate through all implemented screens without crashes during 10 full navigation test runs.
- Lesson completion state saves and restores correctly for 3 test user profiles across multiple sessions.

---

## Planned next steps
- Build the end-of-Lesson-1 simulation/game: users “invest” in the brand/company they chose and see outcomes based on a few key decisions.
- Expand the roadmap by creating additional modules with lessons, quizzes, and interactive mini-games (one full lesson-to-game loop per module).
- Add progress tracking across the full learning loop (lesson completion, quiz results, simulation outcomes) and use it to unlock new modules.
- Improve personalization (profile details that meaningfully change examples, pacing, and recommended modules).
- Make the overall experience more creative and engaging (stronger visuals, more personality, smoother transitions, and clearer “why this matters” moments).
- Implement persistent data storage with Firebase Firestore so accounts, progress, and completion states save and restore across sessions and devices.
- Continue iterative usability testing and polish based on feedback (clarity, pacing, and “does this feel approachable?”).

---

## Tech stack
- Expo and React Native
- Expo Router (file-based navigation)
- Animated API for onboarding motion
- TypeScript
- Ionicons
- Firebase Authentication (planned user auth)
- Firebase Firestore (planned user progress, lesson state, and persistence)

---

## Sources and references

Lesson sources live in the `/docs` folder.

Each lesson has its own markdown file (for example `docs/lesson-1-sources.md`) that lists the educational materials used to inform the content and quiz questions.

This keeps lesson references organized as the curriculum grows while making it easy to trace where concepts originated.

All lesson content is paraphrased and adapted for beginner learning. Brand examples are illustrative only and are not investment recommendations.

## Product philosophy
Invest-ish is built on the idea that investing confidence grows from familiarity rather than information overload.

By starting with brands students already understand, the app reframes investing as curiosity instead of complexity.

---

## Running locally

```bash
npm install
npx expo start