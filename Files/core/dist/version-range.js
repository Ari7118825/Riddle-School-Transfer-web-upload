import { Version } from "./version";
/**
 * Represents a set of version requirements.
 */
export class VersionRange {
    /**
     * Constructs a range of versions as specified by the given requirements.
     *
     * If you wish to construct this object from a string representation,
     * then use [[fromRequirementString]].
     *
     * @param requirements Requirements to set this range by
     */
    constructor(requirements) {
        this.requirements = requirements;
    }
    /**
     * Determine if a given version satisfies this range.
     *
     * @param fver A version object to test against.
     * @returns Whether or not the given version matches this range
     */
    satisfiedBy(fver) {
        for (const requirement of this.requirements) {
            let matches = true;
            for (const { comparator, version } of requirement) {
                matches =
                    matches && version.isStableOrCompatiblePrerelease(fver);
                if (comparator === "" || comparator === "=") {
                    matches = matches && version.isEqual(fver);
                }
                else if (comparator === ">") {
                    matches = matches && fver.hasPrecedenceOver(version);
                }
                else if (comparator === ">=") {
                    matches =
                        matches &&
                            (fver.hasPrecedenceOver(version) ||
                                version.isEqual(fver));
                }
                else if (comparator === "<") {
                    matches = matches && version.hasPrecedenceOver(fver);
                }
                else if (comparator === "<=") {
                    matches =
                        matches &&
                            (version.hasPrecedenceOver(fver) ||
                                version.isEqual(fver));
                }
                else if (comparator === "^") {
                    matches = matches && version.isCompatibleWith(fver);
                }
            }
            if (matches) {
                return true;
            }
        }
        return false;
    }
    /**
     * Parse a requirement string into a version range.
     *
     * @param requirement The version requirements, consisting of a
     * series of space-separated strings, each one being a semver version
     * optionally prefixed by a comparator or a separator.
     *
     * Valid comparators are:
     * - `""` or `"="`: Precisely this version
     * - `">`": A version newer than this one
     * - `">`=": A version newer or equal to this one
     * - `"<"`: A version older than this one
     * - `"<="`: A version older or equal to this one
     * - `"^"`: A version that is compatible with this one
     *
     * A separator is `"||`" which splits the requirement string into
     * left OR right.
     * @returns A version range object.
     */
    static fromRequirementString(requirement) {
        const components = requirement.split(" ");
        let set = [];
        const requirements = [];
        for (const component of components) {
            if (component === "||") {
                if (set.length > 0) {
                    requirements.push(set);
                    set = [];
                }
            }
            else if (component.length > 0) {
                const match = /[0-9]/.exec(component);
                if (match) {
                    const comparator = component.slice(0, match.index).trim();
                    const version = Version.fromSemver(component.slice(match.index).trim());
                    set.push({ comparator, version });
                }
            }
        }
        if (set.length > 0) {
            requirements.push(set);
        }
        return new VersionRange(requirements);
    }
}
