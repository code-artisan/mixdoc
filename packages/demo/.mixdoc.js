const dotenv = require('dotenv');

dotenv.config();

module.exports = () => {
  return {
    // VgQA18gRoObUFaOvpvk0Uh0BZ6mEcNwnON1xSoEj
    token: process.env.TOKEN,
    // ht2xul/heau8f
    namespace: process.env.NAMESPACE,
    directory: 'docs/components',
    libSourceCodeWorkspace: '@mixdoc/ui/lib',
    components: [
      {
        name: 'avatar',
        slug: 'wbxxgz',
      },
      {
        name: 'button',
        slug: 'pz43sp',
      },
    ],
    theme: {
      filepath: 'style/theme.ts',
    },
    property: {
      filepath: 'interface.ts',
    },
    output: {
      image: 'images',
    },
    onFetchDesignDraft(response) {
      // console.log('response...', response);
    },
    onError(error) {
      // console.log(error);
    },
    onComplete() {

    },
    shouldReplaceRemoteImageSourceToLocale: true,
  };
};
