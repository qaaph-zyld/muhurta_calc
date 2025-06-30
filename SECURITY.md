# Security Considerations

## npm Vulnerabilities

As of June 30, 2025, the project has the following npm vulnerabilities:

- 9 vulnerabilities (3 moderate, 6 high) in development dependencies
- Primarily affecting webpack-dev-server, svgo, postcss, and nth-check
- These are nested dependencies of react-scripts

### Mitigation Strategy

1. **Development vs. Production**: These vulnerabilities only affect the development environment, not the production build.

2. **Attempted Fixes**:
   - Direct package updates (nth-check, postcss) - Did not resolve nested dependencies
   - npm overrides - Encountered conflicts with direct dependencies
   - npm resolutions - Encountered implementation challenges

3. **Current Approach**:
   - Continue development with awareness of these vulnerabilities
   - These vulnerabilities do not affect the production build or deployed application
   - Monitor for updates to react-scripts that address these issues
   - Consider upgrading to newer versions of react-scripts in future releases

4. **Future Steps**:
   - Periodically run `npm audit` to check for new vulnerabilities
   - Apply targeted fixes when available
   - Consider more aggressive dependency updates during major version upgrades

## Swiss Ephemeris Integration

- The `rise_trans` function in the Swiss Ephemeris library has been replaced with a reliable astronomical approximation method for sunrise and sunset times
- This approach provides accurate results while avoiding runtime crashes
- Performance tests have been established to monitor calculation efficiency

## General Security Practices

- No API keys or secrets are stored in the codebase
- All user data is processed locally in the browser
- No external API calls are made with user data
