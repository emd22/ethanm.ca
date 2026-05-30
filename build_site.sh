#!/bin/sh

./tlbuilder templates/test.html index.html
./tlbuilder templates/posts.html posts.html
./tlbuilder templates/posts.html posts.html

./tlbuilder templates/posts/01_simd_or_not.html posts/01_simd_or_not.html
