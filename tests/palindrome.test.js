const {palindrome} = require ('../utils/for_testing')

test.skip ('palindrome of pablo', () => {
    const result = palindrome('pablo')

    expect(result).toBe('olbap')
})

test.skip ('palindrome of empty string', () => {
    const result = palindrome('')

    expect(result).toBe('')
})

test.skip ('palindrome of undefined', () => {
    const result = palindrome()

    expect(result).toBeUndefined()
})