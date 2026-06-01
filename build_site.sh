#!/bin/sh

./tlbuilder templates/tl_index.html index.html
./tlbuilder templates/tl_posts.html posts.html

./tlbuilder templates/posts/tl_01_simd_or_not.html posts/01_simd_or_not.html
