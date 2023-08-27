export const stripe = {
  charges: {
    create: jest
      .fn()
      .mockResolvedValue({})
    //this is return us empty object as a promise is resolved
    // .mockImplementation(
    //   (args:{currency:string,token:string,amount:number}, callback: () => void) => {
    //     callback();
    //   }
    // ),
  },
};
