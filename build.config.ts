import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  outDir: 'dist',
  declaration: true,
  rollup: {
    esbuild: {
      minify: true,
    },
    emitCJS: true,
  }
})