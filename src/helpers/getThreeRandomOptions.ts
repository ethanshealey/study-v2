import Option from '@/types/Option'

export default (options: Option[], exclude: Option): Option[] => {
    let random_options: Option[] = structuredClone(options);
    
    random_options = random_options.filter((ro: Option) => ro.content !== exclude.content)

    let len: number = random_options.length;

    while(len) {
        const i: number = Math.floor(Math.random() * len--);
        [random_options[len], random_options[i]] = [random_options[i], random_options[len]];
        random_options[len].isCorrect = false
        random_options[i].isCorrect = false
    }

    return random_options.slice(0, 3);
}