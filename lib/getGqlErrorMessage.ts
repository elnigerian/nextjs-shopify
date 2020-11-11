/**
 * The goal is to tease out the specific error message
 * that is displayed to the user. Avoid the cryptic messaging.
 *
 * @param error
 */
export function getErrorMessage(error: any) {
    if (error.graphQLErrors) {
        for (const graphQLError of error.graphQLErrors) {
            if (
                graphQLError.extensions &&
                graphQLError.extensions.code === 'BAD_USER_INPUT'
            ) {
                return graphQLError.message
            }
        }
    }
    return error.message
}
