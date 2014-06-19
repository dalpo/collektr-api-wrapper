var findBowerTrees = require('broccoli-bower');
var uglifyJavaScript = require('broccoli-uglify-js');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var csso = require('broccoli-csso');

sourceTree = 'src';

/*------------------
  Compact version
 ------------------*/
var jsTree = concat(sourceTree, {
  inputFiles: [
    'js/*.js'
  ],
  outputFile: '/collektrApiWrapper.js'
});
jsTree = uglifyJavaScript(jsTree, {mangle: false, compress: true});
var cssTree = concat(sourceTree, {
  inputFiles: [
    'css/collektr-aw.css'
  ],
  outputFile: '/collektr-aw.css'
});

/*------------------
  Minified version
 ------------------*/
var jsTreeMin = concat(sourceTree, {
  inputFiles: [
    'js/*.js'
  ],
  outputFile: '/collektrApiWrapper.min.js'
});
var cssTreeMin = concat(sourceTree, {
  inputFiles: [
    'css/collektr-aw.css'
  ],
  outputFile: '/collektr-aw.min.css'
});
jsTreeMin = uglifyJavaScript(jsTreeMin, {mangle: true, compress: true});
cssTreeMin = csso(cssTreeMin)

/*------------------
  Packaged version
  is an alpha version, its too soon to get it works
 ------------------*/
var packageTree = findBowerTrees()
packageTree = concat(packageTree, {
  inputFiles: [
    'js/*.js'
  ],
  outputFile: '/collektrApiWrapper.pkg.js'
});
packageTree = uglifyJavaScript(packageTree, {mangle: true, compress: true});


/* EXPORT */
/*
  cmd: broccoli build public
*/
module.exports = mergeTrees([jsTree, jsTreeMin, cssTree, cssTreeMin]);

