const { TestScheduler } = require('@jest/core')
const {average} = require ('../utils/for_testing')

describe.skip('average', () => {
    test ('of one value is the value itself', () => {
        expect(average([1])).toBe(1)
    })

    test ('of many is calculated correctly', () => {
        expect(average([1,2,3,4,5])).toBe(3)
    })

    test ('of an empty array should be zero', () => {
        expect(average([])).toBe(0)
    })
})

