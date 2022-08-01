# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][keep-a-changelog], and this project adheres to [Semantic Versioning][semver].


## [Unreleased]


## [0.6.1] - 2022-08-01
### Fixed
- Forgot to build code before publishing


## [0.6.0] - 2022-08-01
### Added
- Added methods to `CloudflareClient`:
    - `getVariant`
    - `updateVariant`
    - `deleteVariant`
- Add ESLint
### Changed
- Refactor `Cloudflare` types namespace.
- Remove node dependencies; prioritize browser support
- Alter params for `CloudflareClient#uploadFile`
- Improve optional logging support
- Renamed methods of `CloudflareClient`:
    - `createImageVariant` -> `createVariant`
    - `getImageDetails` -> `getImage`
### Fixed
- Incorrect type definition
- Fixed links in `CHANGELOG.md`


## [0.5.0] - 2022-07-30
### Added
- Add `CloudflareClient#getStats`
- Add git tag script


## [0.4.1] - 2022-07-09
### Fixed
- Type definition for `CloudflareClient#listVariants`


## [0.4.0] - 2022-07-09
### Added
- NPM script for building types
- Add `CloudflareClient#listVariants`
### Changed
- Fixed default arguments for `CloudflareClient#listImages`


## [0.3.0] - 2022-07-09
### Fixed
- Deployed type definitions


## [0.2.0] - 2022-07-03
### Added
- Production code


## [0.1.1] - 2022-07-03
### Added
- Added initial code
- Added changelog
- Updated readme


## [0.1.0] - 2022-07-01
- Claimed package name on npm


[Unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/tcd/cloudflare-images/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/tcd/cloudflare-images/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/tcd/cloudflare-images/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/tcd/cloudflare-images/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/tcd/cloudflare-images/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/tcd/cloudflare-images/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/tcd/cloudflare-images/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/tcd/cloudflare-images/releases/tag/v0.1.0
