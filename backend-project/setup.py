import os
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name="bias-assesment",
    version="0.0.1",
    description="Backend for the bias assesment project of the XAI-IML 2023 course.",
    long_description=read("README.md"),
    package_data={
        "": [
            "dataset.csv",
        ]
    },
    data_files=[(
        "data", [
            os.path.join("data", "dataset.csv"),
        ]
    )],
    classifiers=[
        "Intended Audience :: Developers",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Development Status :: 4 - Beta",
    ],
    entry_points={
        "console_scripts": [
            "start-server = dummy_server.router.app:start_server",
        ]
    },
    install_requires=[
        "Flask>=2.0.0",
        "flask-restful>=0.3.9,<0.4",
        "flask-cors>=3.0.10,<3.1",
        "pandas>=1.4.1,<1.5",
        "scikit-learn>=1.0.2",
        "shap",
    ],
    packages=find_packages(where="src", include=["dummy_server*"]),
    package_dir={"": "src"},
)
