# Quadrant // a quiet todo grid

A four-quadrant todo matrix that lives in your new tab page. Drag tasks between quadrants, set deadlines, see what's coming up on the calendar, and customize everything to fit your workflow.

It can be used as an [Eisenhower matrix](https://en.wikipedia.org/wiki/Time_management#Eisenhower_method), or as an [Action Priority Matrix](https://t2informatik.de/en/smartpedia/action-priority-matrix/), or simply just a tool to track your todos in 4 categories.

## Features

- **Four quadrants** - categorize tasks by type (default: Work, University, Personal, Misc)
- **Drag & drop** - move tasks between quadrants instantly
- **Deadlines** - assign a due date to any task with a visual picker
- **Calendar** - click a date to see tasks due that day and filter the matrix
- **Upcoming list** - see the next 8 deadlines at a glance
- **History** - completed tasks go to a slide-out sheet where you can restore or permanently delete them
- **Customizable labels** - rename the four quadrants to anything you want (`Settings` in the `...` menu)
- **Quadrant colors** - set a background color per quadrant
- **Page background** - change the entire page's background color
- **Backup & restore** - export/import your tasks as JSON (merge or replace)

## Screenshots

![Four quadrants. Drag tasks between them, set deadlines, and stay organized.](/images/quadrant.png)
Four quadrants. Drag tasks between them, set deadlines, and stay organized.

![Drag tasks between quadrants to re-categorize on the fly.](/images/drag_and_drop_tasks.png)
Drag tasks between quadrants to re-categorize on the fly.

![Click any date to see what's due - tasks highlight across all quadrants.](/images/calendar.png)
Click any date to see what's due - tasks highlight across all quadrants.

![Fully customizable - rename quadrants, tint their backgrounds, or change the whole page color.](/images/customization.png)
![Colorful](/images/quads4.png)
Fully customizable - rename quadrants, tint their backgrounds, or change the whole page color.

![Completed tasks retire to history - restore or delete them anytime.](/images/history.png)
Completed tasks retire to history - restore or delete them anytime.

## Installation (Chrome)

1. Run `bun run build` (or `npm run build`), which generates the `dist/` folder
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select `dist/`
5. Open a new tab, and the app appears as your new tab page

## Development

```bash
bun i # or npm install
bun run dev # or npm run dev
bun run build # or npm run build --> production build to dist/
```

## License

MIT
