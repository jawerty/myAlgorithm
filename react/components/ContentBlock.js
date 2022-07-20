import "../styles/content-block.scss";

import contentBranding from "../contentBranding";

function ContentBlock({ content }) {

    let branding;
    Object.keys(contentBranding).forEach((brandingDomain) => {
        if (content.source.includes(brandingDomain)) {
            branding = contentBranding[brandingDomain];
        }
    });

    const renderBrandingImage = (brandingImage) => {
        if (content.source.includes('wikipedia.com')) {
            return <img src={brandingImage} />
        } else {
            return brandingImage
        }
    }
    
    return <div className="content-block flex align-start">
        <div className="content-block__content-container">
            {branding?.image && <div className={`content-block__background-branding flex align-center justify-center${content.source.includes('twitter.com') ? ' twitter' : ''}`}>
                {renderBrandingImage(branding.image)}
            </div>}
            {content.title && <a href={content.link}
                target="_blank">
                {content.title}
            </a>}
            {!content.title && <a href={content.link}
                target="_blank">
                {content.link}
            </a>}
            {content.description && <p>
                {content.description}
            </p>}
        </div>
        {content.image && <div className="content-block__image-container flex align-center justify-center">
            <img src={content.image} />
        </div>}
    </div>
}

export default ContentBlock;