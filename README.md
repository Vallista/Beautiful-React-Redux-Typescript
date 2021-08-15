# Beautiful React Redux TypeScript

> 한국어 문서는 [여기서](https://vallista.kr/2020/07/20/TypeScript%EC%97%90%EC%84%9C-Redux-Redux-Saga-%EC%95%84%EB%A6%84%EB%8B%B5%EA%B2%8C-%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0) 보실 수 있습니다!

This document describes how to use React, Redux, Redux-saga, and Typescript beautifully.

## A table of contents

Please read it in the order below.

### [1. Standard](https://github.com/Vallista/Beautiful-React-Redux-Typescript/tree/1.standard)

By default, this section describes how to draw layouts over network communication using React, Redux, Redux saga and TypeScript.

### [2. Modularization](https://github.com/Vallista/Beautiful-React-Redux-Typescript/tree/2.modularization)

Learn how to divide reducers and saga into domain units.

The reason for this division is that reducers and saga have more logic per domain. ex) Managing the status of user domains and product domains.

### [3. Reuse](https://github.com/Vallista/Beautiful-React-Redux-Typescript/tree/3.reuse)

As we divide into various domains, there are many logic overlaps between saga and reducer. Let's separate the logic for reuse.
