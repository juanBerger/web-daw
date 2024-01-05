# Browser Clip Editor / Player

### To Build:
-   `npm run dev`

#### Notes:
- `awp.js` has to live in ./public and `public/awp.js` should be added to tsconfig>include array
- [Dependency Cruiser](https://github.com/sverweij/dependency-cruiser) --> Show a tree of imports: `npx depcruise src --include-only "^src" --output-type dot | dot -T svg > dependency-graph.svg`. 