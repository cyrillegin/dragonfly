#!/bin/bash
echo "Removing node modules"
rm -fr node_modules
echo "Removing pyc files"
find . -name "*.pyc" -type f -delete
echo "Removing bundle files"
find 'dist/' -name "bundle.js" -type f -delete
echo "All clean :)"
