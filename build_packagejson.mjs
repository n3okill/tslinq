import { writeFileSync } from "node:fs";
import { join } from "node:path";

// eslint-disable-next-line security/detect-non-literal-fs-filename
writeFileSync(
  join(import.meta.dirname, "dist", "esm", "package.json"),
  JSON.stringify({ type: "module" }),
);

// eslint-disable-next-line security/detect-non-literal-fs-filename
writeFileSync(
    join(import.meta.dirname, "dist", "cjs", "package.json"),
    JSON.stringify({ type: "commonjs" }),
  );