# Math Study Guide -- documentation

A static website that turns any math notes into study cards and quizzes, with spaced repetition, test prep and 35 built-in math categories.

This directory is a wiki maintained by an LLM: linked markdown pages, nothing outside the
repository. The rules are in [`CLAUDE.md`](CLAUDE.md).

## Start here

1. [[app-overview]]: modules, data model, question shapes, tests
2. [[notes-parser]]: how pasted notes become cards

Changing how notes are read: [[notes-parser]]. Changing quizzes, storage or categories: [[app-overview]].

---

## concepts

_(none yet; added as work touches this area)_

## architecture

- [[app-overview]]: module layout, localStorage data model, spaced repetition, quiz building, math rendering

## subsystems

- [[notes-parser]]: notes to study cards; recognizers, their order, and parser traps

## decisions

_(none yet; added as work touches this area)_

## reference

_(none yet; added as work touches this area)_

## operations

_(none yet; added as work touches this area)_

## history

_(none yet; added as work touches this area)_

---

## Using this wiki

```
/docs-sync     right after a deploy or release -- reads only what changed since verified_at
/docs-lint     integrity check (orphans, broken links, broken sources, stale, unverified)
/docs-query    ask the docs. If it is not there, the answer says so
/docs-status   commits not yet reflected, stale pages, recent work
```

Every page carries `verified_at`, the commit it was checked against. Change code, run
`/docs-sync`.
