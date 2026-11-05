# BioNexa Testing Guide

## Build environment

BioNexa uses GitHub Actions for automated Android builds.

You do not need a PC or Android Studio for the planned APK workflow.

## Automated build

1. Open the BioNexa repository on GitHub.
2. Open the Actions tab.
3. Select BioNexa Android Build.
4. Select Run workflow.
5. Wait for the build to finish.
6. Open the successful workflow run.
7. Download the BioNexa-Android-APK artifact.

## Feature testing

### Navigation
- Open every page.
- Confirm the correct page appears.
- Confirm navigation highlights the selected page.

### AI Tutor
- Submit a question.
- Check that an answer appears.
- Check saved chat history.

### Nexa Practice
- Generate an AI quiz.
- Answer the questions.
- Check explanations and final score.
- Confirm the attempt appears in Practice History.

### Flashcards
- Generate a flashcard set.
- Review the cards.
- Save a deck.
- Reload the app and check saved decks.

### Recommendations
- Complete practice sessions.
- Open Recommendations.
- Select a recommended topic.
- Confirm it opens the quiz with that topic.

### Calculators and formulas
- Test the calculators with known values.
- Search the formula library.

### Notes and planner
- Save notes.
- Add planner tasks.
- Reload the app and check saved information.

### Lecture recorder
- Test microphone permission.
- Record a short sample.
- Stop and check the recording.

## AI service testing

The Gemini Worker must be tested with a real POST request.

A GET response alone does not prove that Gemini generation works.

Do not publish the application until the Worker has appropriate abuse protection.
