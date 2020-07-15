# Beautiful React Redux TypeScript

This document describes how to use React, Redux, Redux-saga, and Typescript beautifully.

## A table of contents

Please read it in the order below.

### [1. Standard](https://naver.com)

By default, this section describes how to draw layouts over network communication using React, Redux, Redux saga and TypeScript.

### [2. Separation](https://naver.com)

Learn how to divide reducers and saga into domain units.

The reason for this division is that reducers and saga have more logic per domain. ex) Managing the status of user domains and product domains.

### [3. Reuse](https://naver.com)

As we divide into various domains, there are many logic overlaps between saga and reducer. Let's separate the logic for reuse.
