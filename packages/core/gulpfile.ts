/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp'
import ts from 'gulp-typescript'

import { default as clean } from './gulp/clean'

const tsProject = ts.createProject('tsconfig.json', {})

const paths = {
  srcipt: {
    source: ['./src/**/*.ts'],
    dest: './dist',
  },
  asset: {
    source: ['./src/**/*.json'],
    dest: './dist',
  },
}

function compile() {
  return gulp
    .src(paths.srcipt.source)
    // .pipe(sourcemaps.init())
    .pipe(tsProject())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.srcipt.dest))
}

function copy() {
  return gulp.src(paths.asset.source).pipe(gulp.dest(paths.asset.dest))
}

function watch() {
  gulp.watch(paths.asset.source, copy)
  gulp.watch(paths.srcipt.source, compile)
}

export default gulp.series(clean, copy, compile)

export const dev = gulp.series(clean, copy, compile, watch)
