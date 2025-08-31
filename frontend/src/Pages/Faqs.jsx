import { useState } from "react";

const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I download videos from this website?",
            answer:
                "Simply paste the video URL into the input box and click on the 'Generate' button. Once the download link is ready, you can save the video to your device."
        },
        {
            question: "Is this downloader free to use?",
            answer:
                "Yes! Our video downloader is completely free and does not require any registration or subscription."
        },
        {
            question: "Which platforms are supported?",
            answer:
                "Currently, we support YouTube, Instagram, Facebook, and Twitter. We're working on adding more platforms soon."
        },
        {
            question: "Is it safe to download videos from here?",
            answer:
                "Absolutely! We don’t store any of your data, and all downloads are processed securely."
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

       return (
        <div className="bg-gray-900 text-white py-16 px-6 md:px-16 transition-all duration-700 ease-in-out">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>

            <div className="max-w-2xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 p-5 rounded-xl shadow-md cursor-pointer transition-all duration-500 hover:scale-[1.02]"
                        onClick={() => toggleFaq(index)}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">{faq.question}</h3>
                            <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
                        </div>
                        <div
                            className={`mt-3 text-gray-300 transition-all duration-500 ease-in-out ${
                                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                            }`}
                        >
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Faqs;
