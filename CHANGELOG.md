# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Refactored client modules
- According to the Flux Standard Action with redux-actions
- Wrapped most of the components by pure render as HOC
- Breaking change of communication protocol over Scoket.IO
- `rooom.notes` is renamed into `room.memo`

### Depencencies
- Update Node.js to 6.x
- Update Material-UI to 0.15.0
- Update Knex.js to 0.11.4

## [1.5.0] - 2016-05-22
### Changed
- Fluorite5: 5.7.0 -> 5.8.1 ([#60](https://github.com/ukatama/nekochat/pull/60))
   - See also: [https://github.com/MirrgieRiana/scriptFluorite5/wiki/Update58](https://github.com/MirrgieRiana/scriptFluorite5/wiki/Update58)

## [1.4.2] - 2016-05-15
### Fixed
- Layout of RoomUpdateDialog ([#59](https://github.com/ukatama/nekochat/issues/59))

## [1.4.1] - 2016-05-14
### Fixed
- Avoid the bug of ESLint ([#6159](https://github.com/eslint/eslint/issues/6159)) 

## [1.4.0] - 2016-05-14
### Added
- FluoriteScript5 dicebot ([#56](https://github.com/ukatama/nekochat/pull/56))
- Icon filter

### Changed
- Database will now be migrated with Knex.js

### Fixed
- XSS on static text view ([#57](https://github.com/ukatama/nekochat/issues/57))

## [1.3.2] - 2016-05-08
### Fixed
- Styles of long notes.

## [1.3.0] - 2016-04-02
### Changed
- Hide edit button on not owned room.

### Added
- Guest login with any user id.
- Upload images with message.
- Session notes.

## [1.2.1] - 2016-03-19
### Added
- Room state. ([#45](https://github.com/ukatama/nekochat/issues/45))

## [1.2.0] - 2016-03-19
### Added
- Update room dialog. ([#50](https://github.com/ukatama/nekochat/issues/50))
- User list. ([#40](https://github.com/ukatama/nekochat/issues/40))

## [1.1.3] - 2016-03-10
### Fixed
- Fix the event of clicking sub-menu on room list. ([#49](https://github.com/ukatama/nekochat/issues/49))

## [1.1.2] - 2016-02-29
### Added
- Use update-changelog to update `CHANGELOG.md`.

## [1.1.1] - 2016-02-29
### Fixed
- Room password has never worked on the text view.

## [1.1.0] - 2016-02-28
### Added
- Room password. ([#7](https://github.com/ukatama/nekochat/issues/7))
