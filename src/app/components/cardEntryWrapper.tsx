const CardEntryWrapper = ({children}: {children: React.ReactNode}) => {

    return (
        <p 
        className="flex flex-row gap-2 text-gray-700 ">
        {children}
      </p>
    )

}

export default CardEntryWrapper;