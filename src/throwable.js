export const throwable = async (promise) => {
    const result = await promise;
    if (result?.error) {
        throw result.error;
    }
    return result?.data;
};
